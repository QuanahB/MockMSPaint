export type ProjectStatus = "on_track" | "at_risk" | "done";

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  updatedAt: string;
  progress: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
};

export type Metric = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

export type Product = {
  id: number | string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  collection: string;
  collection_name: string;
  sizes: string[];
  colors: string[];
  stock: number;
  image_url: string;
};

export type CartItem = {
  id: number | string;
  product_id: number | string;
  size: string;
  quantity: number;
  line_total: number;
  product: Product;
};

export type Cart = {
  id: number | string;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
};

export type CheckoutPayload = {
  email: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
};

export type StoreOrder = {
  id?: number | string;
  status?: string;
};

export type CheckoutStart = {
  checkout_url: string;
  order: StoreOrder;
};
