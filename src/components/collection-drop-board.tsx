"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addCartItem, ApiError, getCollection, getStoreApiUrl } from "@/lib/api";
import { EmptyState, ErrorState, LoadingState } from "@/components/query-state";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Collection, Product } from "@/lib/types";

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

export function CollectionDropBoard({ slug }: { slug: string }) {
  const apiUrl = getStoreApiUrl();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(Boolean(apiUrl));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!apiUrl) {
      return;
    }
    let ignore = false;
    getCollection(slug)
      .then((next) => {
        if (ignore) {
          return;
        }
        setCollection(next);
        setSizes((current) => {
          const nextSizes = { ...current };
          for (const product of next.products ?? []) {
            const key = String(product.id);
            if (!nextSizes[key] && product.sizes?.length) {
              nextSizes[key] = product.sizes[0];
            }
          }
          return nextSizes;
        });
        setError(null);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (ignore) {
          return;
        }
        setError(caught instanceof Error ? caught.message : "Could not load that drop.");
        setCollection(null);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [apiUrl, slug]);

  if (!apiUrl) {
    return (
      <div className="paint-scroll flex min-h-full min-w-[640px] items-start bg-white p-8">
        <div>
          <h1 className="text-xl font-bold">Collections</h1>
          <p className="mt-3 max-w-lg text-[13px]">
            Drops will land here. This page is a canvas placeholder so the Paint window stays
            intact while you design the first collection.
          </p>
        </div>
      </div>
    );
  }

  async function onAdd(product: Product) {
    if (product.stock <= 0) {
      return;
    }
    setPending(`add-${product.id}`);
    setNotice(null);
    setError(null);
    try {
      await addCartItem({
        product_id: product.id,
        size: sizes[String(product.id)] ?? product.sizes[0] ?? "",
        quantity: 1,
      });
      setNotice(`${product.name} is in your cart.`);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : caught instanceof Error
            ? caught.message
            : "Could not add that piece.",
      );
    } finally {
      setPending(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6">
        <LoadingState label="Loading drop" />
      </div>
    );
  }

  if (error && !collection) {
    return (
      <div className="space-y-3 bg-white p-6">
        <ErrorState title="Request failed" description={error} />
        <Link href="/collections" className={buttonVariants()}>
          Back to collections
        </Link>
      </div>
    );
  }

  const products = collection?.products ?? [];

  return (
    <div className="paint-scroll min-h-full min-w-[720px] space-y-8 bg-white p-6">
      <div>
        <p className="text-[12px]">
          <Link href="/collections" className="underline">
            Collections
          </Link>
        </p>
        <h1 className="text-xl font-bold">{collection?.name}</h1>
        <p className="mt-1 text-[13px]">{collection?.season}</p>
        <p className="mt-2 max-w-xl text-[13px]">{collection?.description}</p>
      </div>

      {notice ? (
        <p className="text-[13px]">
          {notice}{" "}
          <Link href="/shop" className="underline">
            Open the shop cart
          </Link>
        </p>
      ) : null}

      {error ? <ErrorState title="Request failed" description={error} /> : null}

      {!products.length ? (
        <EmptyState
          title="No pieces in this drop"
          description="This collection does not have products yet."
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
    </div>
  );
}
