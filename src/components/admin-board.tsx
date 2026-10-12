"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import {
  adminLogin,
  adminLogout,
  ApiError,
  createAdminCollection,
  createAdminProduct,
  deleteAdminCollection,
  deleteAdminProduct,
  getAdminSession,
  getCategories,
  getCollectionList,
  getCollections,
  getProducts,
  getStoreApiUrl,
  updateAdminCollection,
  updateAdminProduct,
} from "@/lib/api";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CatalogOption, Collection, CollectionWrite, Product, ProductWrite } from "@/lib/types";

function catalogImageSrc(url: string | null | undefined) {
  const origin = getStoreApiUrl();
  if (!url) {
    return "";
  }
  if (url.startsWith("http")) {
    return url;
  }
  return `${origin}${url}`;
}

function productImageSrc(product: Product) {
  return catalogImageSrc(product.image_url);
}

function collectionDisplaySrc(collection: Collection) {
  return catalogImageSrc(collection.image_url);
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

function isHttpsLink(value: string) {
  return value.trim().toLowerCase().startsWith("https://");
}

function savedHttpsLink(product: Product) {
  const url = product.image_url?.trim() ?? "";
  return isHttpsLink(url) ? url : "";
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
  const nextLink = (next.image_url ?? "").trim();
  const savedLink = savedHttpsLink(original);
  if (nextLink !== savedLink) {
    patch.image_url = nextLink;
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
  imageUrl: string;
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
    imageUrl: isHttpsLink(product.image_url) ? product.image_url : "",
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
    image_url: form.imageUrl.trim(),
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
  imageUrl: "",
};

type CollectionForm = {
  name: string;
  description: string;
  season: string;
  imageUrl: string;
};

const emptyCollectionCreate: CollectionForm = {
  name: "",
  description: "",
  season: "",
  imageUrl: "",
};

function savedCoverLink(collection: Collection) {
  return collection.custom_image_url?.trim() ?? "";
}

function draftFromCollection(collection: Collection): CollectionForm {
  return {
    name: collection.name,
    description: collection.description,
    season: collection.season,
    imageUrl: savedCoverLink(collection),
  };
}

function toCollectionWrite(form: CollectionForm): CollectionWrite {
  return {
    name: form.name,
    description: form.description,
    season: form.season,
    image_url: form.imageUrl.trim(),
  };
}

function collectionDiff(original: Collection, next: CollectionWrite): Partial<CollectionWrite> {
  const patch: Partial<CollectionWrite> = {};
  if (next.name !== original.name) {
    patch.name = next.name;
  }
  if (next.description !== original.description) {
    patch.description = next.description;
  }
  if (next.season !== original.season) {
    patch.season = next.season;
  }
  if (next.image_url !== savedCoverLink(original)) {
    patch.image_url = next.image_url;
  }
  return patch;
}

function CollectionFields({
  idPrefix,
  value,
  onChange,
}: {
  idPrefix: string;
  value: CollectionForm;
  onChange: (next: CollectionForm) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={value.name}
          onValueChange={(name) => onChange({ ...value, name })}
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
        <Label htmlFor={`${idPrefix}-season`}>Season</Label>
        <Input
          id={`${idPrefix}-season`}
          value={value.season}
          onValueChange={(season) => onChange({ ...value, season })}
        />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-image-url`}>Image link</Label>
        <Input
          id={`${idPrefix}-image-url`}
          value={value.imageUrl}
          onValueChange={(imageUrl) => onChange({ ...value, imageUrl })}
          placeholder="https://"
        />
      </div>
    </div>
  );
}

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
          onValueChange={(name) => onChange({ ...value, name })}
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
          onValueChange={(price) => onChange({ ...value, price: Number(price) })}
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
          onValueChange={(stock) => onChange({ ...value, stock: Number(stock) })}
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
          onValueChange={(sizes) => onChange({ ...value, sizes })}
          placeholder="S, M, L"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-colors`}>Colors</Label>
        <Input
          id={`${idPrefix}-colors`}
          value={value.colors}
          onValueChange={(colors) => onChange({ ...value, colors })}
          placeholder="black, white"
        />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-image-url`}>Image link</Label>
        <Input
          id={`${idPrefix}-image-url`}
          value={value.imageUrl}
          onValueChange={(imageUrl) => onChange({ ...value, imageUrl })}
          placeholder="https://"
        />
      </div>
    </div>
  );
}

export function AdminBoard() {
  const [authed, setAuthed] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<CatalogOption[]>([]);
  const [collections, setCollections] = useState<CatalogOption[]>([]);
  const [drops, setDrops] = useState<Collection[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [createDraft, setCreateDraft] = useState<ProductForm>(emptyCreate);
  const [collectionCreate, setCollectionCreate] = useState<CollectionForm>(emptyCollectionCreate);
  const [edits, setEdits] = useState<Record<string, ProductForm>>({});
  const [dropEdits, setDropEdits] = useState<Record<string, CollectionForm>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [catalogTick, setCatalogTick] = useState(0);

  useEffect(() => {
    let live = true;

    getAdminSession()
      .then((session) => {
        if (!live) {
          return;
        }
        if (session.admin) {
          setCatalogLoading(true);
          setAuthed(true);
        }
      })
      .catch((caught: unknown) => {
        if (!live) {
          return;
        }
        setSessionError(
          caught instanceof Error ? caught.message : "Could not check staff session.",
        );
        setAuthed(false);
      })
      .finally(() => {
        if (live) {
          setSessionChecking(false);
        }
      });

    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!authed) {
      return;
    }
    let ignore = false;
    Promise.all([getProducts(), getCategories(), getCollections(), getCollectionList()])
      .then(([nextProducts, nextCategories, nextCollections, nextDrops]) => {
        if (ignore) {
          return;
        }
        setCatalogError(null);
        setProducts(nextProducts);
        setCategories(nextCategories);
        setCollections(nextCollections);
        setDrops(nextDrops);
        setEdits(
          Object.fromEntries(
            nextProducts.map((product) => [String(product.id), draftFromProduct(product)]),
          ),
        );
        setDropEdits(
          Object.fromEntries(
            nextDrops.map((drop) => [String(drop.id), draftFromCollection(drop)]),
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

  async function submitPassword() {
    const nextPassword = password.trim();
    if (!nextPassword) {
      setSessionError("Type the staff password.");
      return;
    }
    setPending("login");
    setSessionError(null);
    try {
      const session = await adminLogin(nextPassword);
      if (session.admin) {
        setPassword("");
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

  async function reloadDrops() {
    const [nextCollections, nextDrops] = await Promise.all([
      getCollections(),
      getCollectionList(),
    ]);
    setCollections(nextCollections);
    setDrops(nextDrops);
    setDropEdits(
      Object.fromEntries(nextDrops.map((drop) => [String(drop.id), draftFromCollection(drop)])),
    );
    setCreateDraft((current) => ({
      ...current,
      collection: current.collection || nextCollections[0]?.slug || "",
    }));
  }

  async function onCreateCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("collection-create");
    setNotice(null);
    try {
      await createAdminCollection(toCollectionWrite(collectionCreate));
      setCollectionCreate(emptyCollectionCreate);
      await reloadDrops();
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "Could not add that drop.");
    } finally {
      setPending(null);
    }
  }

  async function onSaveCollection(drop: Collection) {
    const draft = dropEdits[String(drop.id)];
    if (!draft) {
      return;
    }
    const patch = collectionDiff(drop, toCollectionWrite(draft));
    if (Object.keys(patch).length === 0) {
      return;
    }
    setPending(`collection-save-${drop.id}`);
    setNotice(null);
    try {
      await updateAdminCollection(drop.id, patch);
      await reloadDrops();
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "Could not save that drop.");
    } finally {
      setPending(null);
    }
  }

  async function onDeleteCollection(drop: Collection) {
    setPending(`collection-delete-${drop.id}`);
    setNotice(null);
    try {
      await deleteAdminCollection(drop.id);
      await reloadDrops();
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 409) {
        setNotice(
          caught.message || "Move or remove this drop's pieces before deleting it.",
        );
      } else {
        setNotice(caught instanceof Error ? caught.message : "Could not delete that drop.");
      }
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

  if (!authed) {
    return (
      <div className="paint-scroll min-h-full min-w-[480px] bg-white p-6">
        <h1 className="text-xl font-bold">Staff lock</h1>
        <p className="mt-1 max-w-lg text-[13px]">
          This catalog editor is for OIMADIS staff. Shoppers do not have accounts. Type the
          password; it is never stored in this page.
        </p>
        {sessionChecking ? (
          <p className="mt-3 text-[13px] text-[#808080]">Checking staff session…</p>
        ) : null}
        {sessionError ? (
          <div className="mt-4">
            <ErrorState title="Request failed" description={sessionError} />
          </div>
        ) : null}
        <div className="mt-6 max-w-sm space-y-3">
          <div className="space-y-1">
            <Label htmlFor="admin-password">Password</Label>
            <input
              id="admin-password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void submitPassword();
                }
              }}
              className="win-sunken h-[23px] w-full min-w-0 rounded-none bg-white px-1.5 py-0 text-[12px] text-black outline-none"
            />
          </div>
          <button
            type="button"
            className={buttonVariants()}
            disabled={pending === "login"}
            onClick={() => void submitPassword()}
          >
            {pending === "login" ? "Opening…" : "Unlock"}
          </button>
        </div>
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
            Add and edit drops and pieces. A drop cover takes an https photo link. Leave it blank
            to keep the first piece&apos;s picture on Collections. A blank piece image keeps the
            generated canvas.
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
          <CardTitle>Collections</CardTitle>
          <CardDescription>
            Creates a drop on the store API. Renaming it keeps the public address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreateCollection} className="space-y-4" noValidate>
            <CollectionFields
              idPrefix="collection-create"
              value={collectionCreate}
              onChange={setCollectionCreate}
            />
            <Button
              type="submit"
              disabled={pending === "collection-create" || !collectionCreate.name}
            >
              {pending === "collection-create" ? "Saving…" : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {drops.map((drop) => {
        const key = String(drop.id);
        const draft = dropEdits[key] ?? draftFromCollection(drop);
        const src = collectionDisplaySrc(drop);
        return (
          <Card key={`drop-${key}`}>
            <div className="grid gap-0 sm:grid-cols-[160px_1fr]">
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={drop.name}
                  className="h-40 w-full object-cover sm:h-full"
                />
              ) : (
                <div className="win-sunken flex h-40 items-center justify-center bg-white text-[12px] sm:h-full">
                  No image
                </div>
              )}
              <div>
                <CardHeader>
                  <CardTitle>{drop.name}</CardTitle>
                  <CardDescription>
                    {drop.slug} · {drop.season || "No season"} · {drop.product_count}{" "}
                    {drop.product_count === 1 ? "piece" : "pieces"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CollectionFields
                    idPrefix={`collection-edit-${key}`}
                    value={draft}
                    onChange={(next) =>
                      setDropEdits((current) => ({ ...current, [key]: next }))
                    }
                  />
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    type="button"
                    disabled={pending === `collection-save-${drop.id}`}
                    onClick={() => void onSaveCollection(drop)}
                  >
                    {pending === `collection-save-${drop.id}` ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={pending === `collection-delete-${drop.id}`}
                    onClick={() => void onDeleteCollection(drop)}
                  >
                    {pending === `collection-delete-${drop.id}` ? "Deleting…" : "Delete"}
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        );
      })}

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
