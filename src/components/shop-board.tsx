"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  getCart,
  getProducts,
  getStoreApiUrl,
  removeCartItem,
  startCheckout,
  updateCartItem,
} from "@/lib/api";
import { EmptyState, ErrorState, LoadingState } from "@/components/query-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cart, Product } from "@/lib/types";

function money(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

function productImageSrc(product: Product) {
  const origin = getStoreApiUrl();
  if (!product.image_url) {
    return "";
  }
  if (product.image_url.startsWith("http")) {
    return product.image_url;
  }
  return `${origin}${product.image_url}`;
}

export function ShopBoard() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function refresh(showSpinner = false) {
    if (showSpinner) {
      setLoading(true);
    }
    setError(null);
    try {
      const [nextProducts, nextCart] = await Promise.all([getProducts(), getCart()]);
      setProducts(nextProducts);
      setCart(nextCart);
      setSizes((current) => {
        const next = { ...current };
        for (const product of nextProducts) {
          const key = String(product.id);
          if (!next[key] && product.sizes?.length) {
            next[key] = product.sizes[0];
          }
        }
        return next;
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the shop.");
      setProducts(null);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    Promise.all([getProducts(), getCart()])
      .then(([nextProducts, nextCart]) => {
        if (ignore) {
          return;
        }
        setProducts(nextProducts);
        setCart(nextCart);
        setSizes((current) => {
          const next = { ...current };
          for (const product of nextProducts) {
            const key = String(product.id);
            if (!next[key] && product.sizes?.length) {
              next[key] = product.sizes[0];
            }
          }
          return next;
        });
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (ignore) {
          return;
        }
        setError(caught instanceof Error ? caught.message : "Could not load the shop.");
        setProducts(null);
        setCart(null);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const currency = cart?.currency || products?.[0]?.currency || "USD";

  const checkoutDisabled = useMemo(
    () => !cart || cart.items.length === 0 || pending === "checkout",
    [cart, pending],
  );

  async function onAdd(product: Product) {
    if (product.stock <= 0) {
      return;
    }
    setPending(`add-${product.id}`);
    setCheckoutError(null);
    try {
      const nextCart = await addCartItem({
        product_id: product.id,
        size: sizes[String(product.id)] ?? product.sizes[0] ?? "",
        quantity: 1,
      });
      setCart(nextCart);
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : "Could not add that piece.");
    } finally {
      setPending(null);
    }
  }

  async function onQuantity(itemId: Cart["items"][number]["id"], quantity: number) {
    setPending(`qty-${itemId}`);
    setCheckoutError(null);
    try {
      const nextCart = await updateCartItem(itemId, quantity);
      setCart(nextCart?.items ? nextCart : await getCart());
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : "Could not update the cart.");
    } finally {
      setPending(null);
    }
  }

  async function onRemove(itemId: Cart["items"][number]["id"]) {
    setPending(`rm-${itemId}`);
    setCheckoutError(null);
    try {
      const nextCart = await removeCartItem(itemId);
      setCart(nextCart ?? (await getCart()));
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : "Could not remove that line.");
    } finally {
      setPending(null);
    }
  }

  async function onCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending("checkout");
    setCheckoutError(null);
    try {
      const result = await startCheckout({
        email: String(data.get("email") ?? "").trim(),
        shipping_name: String(data.get("shipping_name") ?? "").trim(),
        shipping_address: String(data.get("shipping_address") ?? "").trim(),
        shipping_city: String(data.get("shipping_city") ?? "").trim(),
        shipping_postal_code: String(data.get("shipping_postal_code") ?? "").trim(),
      });
      window.location.assign(result.checkout_url);
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : "Checkout failed.");
      setPending(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6">
        <LoadingState label="Loading shop" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 bg-white p-6">
        <ErrorState title="Shop could not load" description={error} />
        <Button type="button" onClick={() => void refresh(true)}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="paint-scroll min-h-full min-w-[720px] space-y-8 bg-white p-6">
      <div>
        <h1 className="text-xl font-bold">Shop</h1>
        <p className="mt-1 text-[13px]">
          Test checkout against the OIMADIS API. Stripe stays in test mode; this page never marks
          an order paid.
        </p>
      </div>

      {checkoutError ? (
        <ErrorState title="Request failed" description={checkoutError} />
      ) : null}

      {!products?.length ? (
        <EmptyState
          title="No pieces in stock"
          description="The API returned an empty catalog."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => {
            const key = String(product.id);
            const src = productImageSrc(product);
            return (
              <Card key={key}>
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={product.name}
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-bold">{money(product.price, product.currency)}</p>
                  <p>{product.collection_name}</p>
                  <p>{product.stock} in stock</p>
                  <div className="space-y-1">
                    <Label htmlFor={`size-${key}`}>Size</Label>
                    <select
                      id={`size-${key}`}
                      className="win-sunken h-[23px] w-full bg-white px-1 text-[12px]"
                      value={sizes[key] ?? product.sizes[0] ?? ""}
                      onChange={(event) =>
                        setSizes((current) => ({ ...current, [key]: event.target.value }))
                      }
                      disabled={!product.sizes?.length}
                    >
                      {(product.sizes ?? []).map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={product.stock <= 0 || pending === `add-${product.id}`}
                    onClick={() => void onAdd(product)}
                  >
                    {product.stock <= 0
                      ? "Sold out"
                      : pending === `add-${product.id}`
                        ? "Adding…"
                        : "Add to cart"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cart</CardTitle>
          <CardDescription>
            {cart ? `${cart.item_count} item(s)` : "Your bag is empty."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!cart?.items.length ? (
            <p>Nothing in the cart yet.</p>
          ) : (
            cart.items.map((item) => (
              <div key={String(item.id)} className="win-sunken space-y-2 bg-white p-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.product?.name ?? `Product ${item.product_id}`}</p>
                    <p>Size {item.size}</p>
                    <p>{money(item.line_total, currency)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={pending === `rm-${item.id}`}
                    onClick={() => void onRemove(item.id)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`qty-${item.id}`}>Qty</Label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min={0}
                    className="w-16"
                    key={`qty-${item.id}-${item.quantity}`}
                    defaultValue={item.quantity}
                    disabled={pending?.startsWith("qty-") || pending === `rm-${item.id}`}
                    onBlur={(event) => {
                      const quantity = Number(event.currentTarget.value);
                      if (Number.isFinite(quantity) && quantity !== item.quantity) {
                        void onQuantity(item.id, quantity);
                      }
                    }}
                  />
                </div>
              </div>
            ))
          )}
          {cart ? (
            <div className="space-y-1 border-t border-[#808080] pt-2">
              <p>Subtotal {money(cart.subtotal, currency)}</p>
              <p>Shipping {money(cart.shipping, currency)}</p>
              <p className="font-bold">Total {money(cart.total, currency)}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            Stripe hosted test checkout opens next. Paid status is confirmed after return.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onCheckout}
            action="#"
            method="post"
            className="grid gap-3 sm:grid-cols-2"
            noValidate
          >
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="shipping_name">Shipping name</Label>
              <Input
                id="shipping_name"
                name="shipping_name"
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="shipping_address">Shipping address</Label>
              <Input
                id="shipping_address"
                name="shipping_address"
                autoComplete="street-address"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shipping_city">City</Label>
              <Input
                id="shipping_city"
                name="shipping_city"
                autoComplete="address-level2"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shipping_postal_code">Postal code</Label>
              <Input
                id="shipping_postal_code"
                name="shipping_postal_code"
                autoComplete="postal-code"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={checkoutDisabled}>
                {pending === "checkout" ? "Opening Stripe…" : "Checkout"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
