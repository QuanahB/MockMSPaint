"use client";

import { useEffect, useState } from "react";
import { confirmCheckout, getStoreApiUrl } from "@/lib/api";
import { ErrorState, LoadingState } from "@/components/query-state";
import type { StoreOrder } from "@/lib/types";

function orderFromPayload(data: StoreOrder | { order: StoreOrder }): StoreOrder {
  if (
    data &&
    typeof data === "object" &&
    "order" in data &&
    data.order &&
    typeof data.order === "object"
  ) {
    return data.order;
  }
  return data as StoreOrder;
}

export function CheckoutReturn({
  sessionId,
  cancelled,
}: {
  sessionId?: string;
  cancelled?: boolean;
}) {
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId && getStoreApiUrl()));

  useEffect(() => {
    if (!sessionId || !getStoreApiUrl()) {
      return;
    }
    let ignore = false;
    confirmCheckout(sessionId)
      .then((payload) => {
        if (!ignore) {
          setOrder(orderFromPayload(payload));
          setLoading(false);
        }
      })
      .catch((caught: unknown) => {
        if (!ignore) {
          setError(caught instanceof Error ? caught.message : "Could not confirm checkout.");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [sessionId]);

  if (cancelled) {
    return (
      <div className="win-sunken bg-white p-3 text-[13px]">
        Payment was cancelled. The pieces stay reserved until the Stripe session expires.
      </div>
    );
  }

  if (!sessionId) {
    return null;
  }

  if (loading) {
    return <LoadingState label="Confirming payment" />;
  }

  if (error) {
    return <ErrorState title="Could not confirm checkout" description={error} />;
  }

  const status = String(order?.status ?? "pending").toLowerCase();

  return (
    <div className="win-sunken space-y-1 bg-white p-3 text-[13px]">
      <p className="font-bold">Checkout confirm</p>
      <p>
        Order status: <span className="font-bold">{status}</span>
        {status === "paid" ? " — Stripe reported payment." : " — still pending."}
      </p>
    </div>
  );
}
