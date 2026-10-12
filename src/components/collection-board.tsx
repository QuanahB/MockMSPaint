"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCollectionList, getStoreApiUrl } from "@/lib/api";
import { EmptyState, ErrorState, LoadingState } from "@/components/query-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Collection } from "@/lib/types";

function collectionImageSrc(collection: Collection) {
  const origin = getStoreApiUrl();
  if (!collection.image_url) {
    return "";
  }
  if (collection.image_url.startsWith("http")) {
    return collection.image_url;
  }
  return `${origin}${collection.image_url}`;
}

export function CollectionBoard() {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let ignore = false;
    getCollectionList()
      .then((next) => {
        if (ignore) {
          return;
        }
        setCollections(next);
        setError(null);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (ignore) {
          return;
        }
        setError(caught instanceof Error ? caught.message : "Could not load collections.");
        setCollections(null);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [reload]);

  if (loading) {
    return (
      <div className="bg-white p-6">
        <LoadingState label="Loading collections" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 bg-white p-6">
        <ErrorState title="Request failed" description={error} />
        <Button
          type="button"
          onClick={() => {
            setLoading(true);
            setReload((value) => value + 1);
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="paint-scroll min-h-full min-w-[720px] space-y-8 bg-white p-6">
      <div>
        <h1 className="text-xl font-bold">Collections</h1>
        <p className="mt-1 text-[13px]">Drops from the OIMADIS closet.</p>
      </div>

      {!collections?.length ? (
        <EmptyState
          title="No drops yet"
          description="There are no drops yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map((collection) => {
            const src = collectionImageSrc(collection);
            return (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="block text-inherit no-underline"
              >
                <Card>
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={collection.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : null}
                  <CardHeader>
                    <CardTitle>{collection.name}</CardTitle>
                    <CardDescription>{collection.season}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>{collection.description}</p>
                    <p>
                      {collection.product_count}{" "}
                      {collection.product_count === 1 ? "piece" : "pieces"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
