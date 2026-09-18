import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = { title: "Browse · Vonami" };

export default function SearchPage() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  );
}
