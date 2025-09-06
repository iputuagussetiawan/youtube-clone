import { HydrateClient, trpc } from "@/trpc/server";
import { PageHomeClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <PageHomeClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
