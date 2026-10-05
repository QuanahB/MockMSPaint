import { activity, metrics, projects } from "@/lib/mock-data";
import type { Cart, CheckoutPayload, CheckoutStart, Product, StoreOrder } from "@/lib/types";

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

  const res = await fetch(`${base}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    throw new ApiError(await readErrorMessage(res), res.status);
  }

  return res.json() as Promise<T>;
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
