import { activity, metrics, projects } from "@/lib/mock-data";
import type {
  AdminSession,
  BoardNote,
  Cart,
  CatalogOption,
  CheckoutPayload,
  CheckoutStart,
  Product,
  ProductWrite,
  StoreOrder,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function getStoreApiUrl() {
  return API_BASE?.replace(/\/$/, "") ?? "";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readErrorMessage(res: Response) {
  try {
    const data = (await res.json()) as { message?: string };
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // Ignore empty or non-JSON bodies.
  }
  return `Request failed (${res.status})`;
}

export function getProjects() {
  return Promise.resolve(projects);
}

export function getMetrics() {
  return Promise.resolve(metrics);
}

export function getActivity() {
  return Promise.resolve(activity);
}

async function storeRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getStoreApiUrl();
  if (!base) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not set");
  }

  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers,
      signal: init?.signal ?? AbortSignal.timeout(45_000),
    });

    if (res.status === 204) {
      return undefined as T;
    }

    if (!res.ok) {
      throw new ApiError(await readErrorMessage(res), res.status);
    }

    return res.json() as Promise<T>;
  } catch (caught) {
    if (caught instanceof ApiError) {
      throw caught;
    }
    const name = caught instanceof Error ? caught.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new ApiError("The store API did not respond.");
    }
    throw new ApiError(caught instanceof Error ? caught.message : "Request failed");
  }
}

function asProductList(data: unknown): Product[] {
  if (Array.isArray(data)) {
    return data as Product[];
  }
  if (data && typeof data === "object" && Array.isArray((data as { products?: unknown }).products)) {
    return (data as { products: Product[] }).products;
  }
  throw new ApiError("The products response was not a list");
}

export function getProducts() {
  return storeRequest<unknown>("/products").then(asProductList);
}

export function getCart() {
  return storeRequest<Cart>("/cart");
}

export function addCartItem(body: {
  product_id: Product["id"];
  size: string;
  quantity: number;
}) {
  return storeRequest<Cart>("/cart/items", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateCartItem(id: Cart["items"][number]["id"], quantity: number) {
  return storeRequest<Cart>(`/cart/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id: Cart["items"][number]["id"]) {
  return storeRequest<Cart | undefined>(`/cart/items/${id}`, {
    method: "DELETE",
  });
}

export function startCheckout(body: CheckoutPayload) {
  return storeRequest<CheckoutStart>("/checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function confirmCheckout(sessionId: string) {
  const query = new URLSearchParams({ session_id: sessionId });
  return storeRequest<StoreOrder | { order: StoreOrder }>(
    `/checkout/confirm?${query.toString()}`,
  );
}

function asOptionList(data: unknown, key: "categories" | "collections"): CatalogOption[] {
  const rows = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as Record<string, unknown>)[key])
      ? ((data as Record<string, unknown>)[key] as unknown[])
      : null;
  if (!rows) {
    throw new ApiError(`The ${key} response was not a list`);
  }
  return rows.map((row) => {
    if (typeof row === "string") {
      return { slug: row };
    }
    if (row && typeof row === "object" && "slug" in row) {
      const option = row as CatalogOption;
      return { slug: option.slug, name: option.name };
    }
    throw new ApiError(`A ${key} entry was missing a slug`);
  });
}

function asProduct(data: unknown): Product {
  if (data && typeof data === "object" && "product" in data) {
    return (data as { product: Product }).product;
  }
  return data as Product;
}

export async function getAdminSession() {
  try {
    return await storeRequest<AdminSession>("/admin/session");
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 401) {
      return { admin: false };
    }
    throw caught;
  }
}

export function adminLogin(password: string) {
  return storeRequest<AdminSession>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function adminLogout() {
  return storeRequest<AdminSession | undefined>("/admin/logout", {
    method: "POST",
  });
}

export function getCategories() {
  return storeRequest<unknown>("/categories").then((data) =>
    asOptionList(data, "categories"),
  );
}

export function getCollections() {
  return storeRequest<unknown>("/collections").then((data) =>
    asOptionList(data, "collections"),
  );
}

export function createAdminProduct(body: ProductWrite) {
  return storeRequest<unknown>("/admin/products", {
    method: "POST",
    body: JSON.stringify(body),
  }).then(asProduct);
}

export function updateAdminProduct(id: Product["id"], body: Partial<ProductWrite>) {
  return storeRequest<unknown>(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }).then(asProduct);
}

export function deleteAdminProduct(id: Product["id"]) {
  return storeRequest<undefined>(`/admin/products/${id}`, {
    method: "DELETE",
  });
}

function asBoardNotes(data: unknown): BoardNote[] {
  if (!Array.isArray(data)) {
    throw new ApiError("The board response was not a list");
  }
  return data as BoardNote[];
}

function asBoardNote(data: unknown): BoardNote {
  if (data && typeof data === "object" && "note" in data) {
    return (data as { note: BoardNote }).note;
  }
  return data as BoardNote;
}

export function getBoardNotes() {
  return storeRequest<unknown>("/board").then(asBoardNotes);
}

export function postBoardNote(message: string) {
  return storeRequest<unknown>("/board", {
    method: "POST",
    body: JSON.stringify({ message }),
  }).then(asBoardNote);
}

export function deleteBoardNote(id: number) {
  return storeRequest<undefined>(`/admin/board/${id}`, {
    method: "DELETE",
  });
}

