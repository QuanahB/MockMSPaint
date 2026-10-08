"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import {
  adminLogin,
  adminLogout,
  ApiError,
  createAdminProduct,
  deleteAdminProduct,
  getAdminSession,
  getCategories,
  getCollections,
  getProducts,
  getStoreApiUrl,
  updateAdminProduct,
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
import { Textarea } from "@/components/ui/textarea";
import type { CatalogOption, Product, ProductWrite } from "@/lib/types";

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

function parseList(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function formatList(value: string[] | undefined) {
  return (value ?? []).join(", ");
}

function sameList(left: string[], right: string[]) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function productDiff(original: Product, next: ProductWrite): Partial<ProductWrite> {
  const patch: Partial<ProductWrite> = {};
  if (next.name !== original.name) {
    patch.name = next.name;
  }
  if (next.description !== original.description) {
    patch.description = next.description;
  }
  if (next.price !== original.price) {
    patch.price = next.price;
  }
  if (next.category !== original.category) {
    patch.category = next.category;
  }
  if (next.collection !== original.collection) {
    patch.collection = next.collection;
  }
  if (!sameList(next.sizes, original.sizes ?? [])) {
    patch.sizes = next.sizes;
  }
  if (!sameList(next.colors, original.colors ?? [])) {
    patch.colors = next.colors;
  }
  if (next.stock !== original.stock) {
    patch.stock = next.stock;
  }
  return patch;
}

type ProductForm = {
  name: string;
  description: string;
  price: number;
  category: string;
  collection: string;
  sizes: string;
  colors: string;
  stock: number;
};

function draftFromProduct(product: Product): ProductForm {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    collection: product.collection,
    sizes: formatList(product.sizes),
    colors: formatList(product.colors),
    stock: product.stock,
  };
}

function toWrite(form: ProductForm): ProductWrite {
  return {
    name: form.name,
    description: form.description,
    price: form.price,
    category: form.category,
    collection: form.collection,
    sizes: parseList(form.sizes),
    colors: parseList(form.colors),
    stock: form.stock,
  };
}

const emptyCreate: ProductForm = {
  name: "",
  description: "",
  price: 0,
  category: "",
  collection: "",
  sizes: "",
  colors: "",
  stock: 0,
};

function OptionSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: CatalogOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="win-sunken h-[23px] w-full bg-white px-1 text-[12px]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.name ?? option.slug}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProductFields({
  idPrefix,
  value,
  categories,
  collections,
  onChange,
}: {
  idPrefix: string;
  value: ProductForm;
  categories: CatalogOption[];
  collections: CatalogOption[];
  onChange: (next: ProductForm) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
        />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-description`}>Description</Label>
        <Textarea
          id={`${idPrefix}-description`}
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-price`}>Price (USD)</Label>
        <Input
          id={`${idPrefix}-price`}
          type="number"
          min={0}
          step="0.01"
          value={Number.isFinite(value.price) ? value.price : ""}
          onChange={(event) =>
            onChange({ ...value, price: Number(event.target.value) })
          }
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-stock`}>Stock</Label>
        <Input
          id={`${idPrefix}-stock`}
          type="number"
          min={0}
          step="1"
          value={Number.isFinite(value.stock) ? value.stock : ""}
          onChange={(event) =>
            onChange({ ...value, stock: Number(event.target.value) })
          }
        />
      </div>
      <OptionSelect
        id={`${idPrefix}-category`}
        label="Category"
        value={value.category}
        options={categories}
        onChange={(category) => onChange({ ...value, category })}
      />
      <OptionSelect
        id={`${idPrefix}-collection`}
        label="Collection"
        value={value.collection}
        options={collections}
        onChange={(collection) => onChange({ ...value, collection })}
      />
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-sizes`}>Sizes</Label>
        <Input
          id={`${idPrefix}-sizes`}
          value={value.sizes}
          onChange={(event) => onChange({ ...value, sizes: event.target.value })}
          placeholder="S, M, L"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-colors`}>Colors</Label>
        <Input
          id={`${idPrefix}-colors`}
          value={value.colors}
          onChange={(event) => onChange({ ...value, colors: event.target.value })}
          placeholder="black, white"
        />
      </div>
    </div>
  );
}

export function AdminBoard() {
  const [sessionReady, setSessionReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<CatalogOption[]>([]);
  const [collections, setCollections] = useState<CatalogOption[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [createDraft, setCreateDraft] = useState<ProductForm>(emptyCreate);
  const [edits, setEdits] = useState<Record<string, ProductForm>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [catalogTick, setCatalogTick] = useState(0);

  useEffect(() => {
    let ignore = false;
    getAdminSession()
      .then((session) => {
        if (ignore) {
          return;
        }
        const isAdmin = Boolean(session.admin);
        setAuthed(isAdmin);
        if (isAdmin) {
          setCatalogLoading(true);
        }
        setSessionReady(true);
      })
      .catch((caught: unknown) => {
        if (ignore) {
          return;
        }
        setSessionError(caught instanceof Error ? caught.message : "Could not check staff session.");
        setAuthed(false);
        setSessionReady(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!authed) {
      return;
    }
    let ignore = false;
    Promise.all([getProducts(), getCategories(), getCollections()])
      .then(([nextProducts, nextCategories, nextCollections]) => {
        if (ignore) {
          return;
        }
        setCatalogError(null);
        setProducts(nextProducts);
        setCategories(nextCategories);
        setCollections(nextCollections);
        setEdits(
          Object.fromEntries(
            nextProducts.map((product) => [String(product.id), draftFromProduct(product)]),
          ),
        );
        setCreateDraft((current) => ({
          ...current,
          category: current.category || nextCategories[0]?.slug || "",
          collection: current.collection || nextCollections[0]?.slug || "",
        }));
        setCatalogLoading(false);
      })
      .catch((caught: unknown) => {
        if (ignore) {
          return;
        }
        setCatalogError(caught instanceof Error ? caught.message : "Could not load the catalog.");
        setProducts(null);
        setCatalogLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [authed, catalogTick]);

  async function onLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("login");
    setSessionError(null);
    try {
      const session = await adminLogin(password);
      setPassword("");
      if (session.admin) {
        setCatalogLoading(true);
        setAuthed(true);
      } else {
        setSessionError("That password did not open the catalog.");
      }
    } catch (caught) {
      setSessionError(caught instanceof Error ? caught.message : "Login failed.");
    } finally {
      setPending(null);
    }
  }

  async function onLogout() {
    setPending("logout");
    setNotice(null);
    try {
      await adminLogout();
      setAuthed(false);
      setProducts(null);
      setPassword("");
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "Could not lock the catalog.");
    } finally {
      setPending(null);
    }
  }

  async function onCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("create");
    setNotice(null);
    try {
      const created = await createAdminProduct(toWrite(createDraft));
      setProducts((current) => [created, ...(current ?? [])]);
      setEdits((current) => ({
        [String(created.id)]: draftFromProduct(created),
        ...current,
      }));
      setCreateDraft({
        ...emptyCreate,
        category: categories[0]?.slug || "",
        collection: collections[0]?.slug || "",
      });
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "Could not add that piece.");
    } finally {
      setPending(null);
    }
  }

  async function onSave(product: Product) {
    const draft = edits[String(product.id)];
    if (!draft) {
      return;
    }
    const patch = productDiff(product, toWrite(draft));
    if (Object.keys(patch).length === 0) {
      return;
    }
    setPending(`save-${product.id}`);
    setNotice(null);
    try {
      const updated = await updateAdminProduct(product.id, patch);
      setProducts((current) =>
        (current ?? []).map((item) => (String(item.id) === String(updated.id) ? updated : item)),
      );
      setEdits((current) => ({
        ...current,
        [String(updated.id)]: draftFromProduct(updated),
      }));
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "Could not save that piece.");
    } finally {
      setPending(null);
    }
  }

  async function onDelete(product: Product) {
    setPending(`delete-${product.id}`);
    setNotice(null);
    try {
      await deleteAdminProduct(product.id);
      setProducts((current) => (current ?? []).filter((item) => String(item.id) !== String(product.id)));
      setEdits((current) => {
        const next = { ...current };
        delete next[String(product.id)];
        return next;
      });
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 409) {
        setNotice(caught.message);
      } else {
        setNotice(caught instanceof Error ? caught.message : "Could not delete that piece.");
      }
    } finally {
      setPending(null);
    }
  }

  if (!sessionReady) {
    return (
      <div className="bg-white p-6">
        <LoadingState label="Checking staff session" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="paint-scroll min-h-full min-w-[480px] bg-white p-6">
        <h1 className="text-xl font-bold">Staff lock</h1>
        <p className="mt-1 max-w-lg text-[13px]">
          This catalog editor is for OIMADIS staff. Shoppers do not have accounts. Type the
          password; it is never stored in this page.
        </p>
        {sessionError ? (
          <div className="mt-4">
            <ErrorState title="Request failed" description={sessionError} />
          </div>
        ) : null}
        <form onSubmit={onLogin} className="mt-6 max-w-sm space-y-3" noValidate>
          <div className="space-y-1">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={pending === "login" || !password}>
            {pending === "login" ? "Opening…" : "Unlock"}
          </Button>
        </form>
      </div>
    );
  }

  if (catalogLoading) {
    return (
      <div className="bg-white p-6">
        <LoadingState label="Loading catalog" />
      </div>
    );
  }

  if (catalogError) {
    return (
      <div className="space-y-3 bg-white p-6">
        <ErrorState title="Request failed" description={catalogError} />
        <Button
          type="button"
          onClick={() => {
            setCatalogError(null);
            setCatalogLoading(true);
            setCatalogTick((value) => value + 1);
          }}
        >
          Retry
        </Button>
        <Button type="button" variant="outline" onClick={() => void onLogout()}>
          Lock
        </Button>
      </div>
    );
  }

  return (
    <div className="paint-scroll min-h-full min-w-[720px] space-y-8 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Catalog</h1>
          <p className="mt-1 max-w-xl text-[13px]">
            Add and edit pieces for the shop. Images stay on the API; this window only writes
            copy, price, category, collection, sizes, colors, and stock.
          </p>
        </div>
        <Button type="button" onClick={() => void onLogout()} disabled={pending === "logout"}>
          <Lock />
          {pending === "logout" ? "Locking…" : "Lock"}
        </Button>
      </div>

      {notice ? <ErrorState title="Request failed" description={notice} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>New piece</CardTitle>
          <CardDescription>Creates a product on the store API.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="space-y-4" noValidate>
            <ProductFields
              idPrefix="create"
              value={createDraft}
              categories={categories}
              collections={collections}
              onChange={setCreateDraft}
            />
            <Button type="submit" disabled={pending === "create" || !createDraft.name}>
              {pending === "create" ? "Saving…" : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {!products?.length ? (
        <EmptyState
          title="No pieces yet"
          description="Create the first garment above. It will appear here after the API returns 201."
        />
      ) : (
        <div className="grid gap-4">
          {products.map((product) => {
            const key = String(product.id);
            const draft = edits[key] ?? draftFromProduct(product);
            const src = productImageSrc(product);
            return (
              <Card key={key}>
                <div className="grid gap-0 sm:grid-cols-[160px_1fr]">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={product.name}
                      className="h-40 w-full object-cover sm:h-full"
                    />
                  ) : (
                    <div className="win-sunken flex h-40 items-center justify-center bg-white text-[12px] sm:h-full">
                      No image
                    </div>
                  )}
                  <div>
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>
                        {product.slug} · {product.collection_name || product.collection}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProductFields
                        idPrefix={`edit-${key}`}
                        value={draft}
                        categories={categories}
                        collections={collections}
                        onChange={(next) =>
                          setEdits((current) => ({ ...current, [key]: next }))
                        }
                      />
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button
                        type="button"
                        disabled={pending === `save-${product.id}`}
                        onClick={() => void onSave(product)}
                      >
                        {pending === `save-${product.id}` ? "Saving…" : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={pending === `delete-${product.id}`}
                        onClick={() => void onDelete(product)}
                      >
                        {pending === `delete-${product.id}` ? "Deleting…" : "Delete"}
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
