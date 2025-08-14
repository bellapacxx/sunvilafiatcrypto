import { Suspense } from "react";
import QuotePageClient from "./QuotePageClient";

export default function QuotePage() {
  return (
    <Suspense fallback={<p className="text-center mt-6">Loading quote...</p>}>
      <QuotePageClient />
    </Suspense>
  );
}
