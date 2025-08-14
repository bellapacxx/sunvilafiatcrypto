'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

type Asset = { symbol: string };
type Quote = {
  id: string;
  rate: number;
  amtFiat: number;
  amtCrypto: number;
  asset: Asset;
  fees: { platform?: number; network?: number };
};

export default function QuotePageClient() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("id");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [secs, setSecs] = useState(0);

  // Fetch quote details
  const fetchQuote = async () => {
    if (!quoteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}`);
      const data: Quote = await res.json();
      setQuote(data);

      const expiry = new Date(Date.now() + 30000);
      setSecs(Math.ceil((expiry.getTime() - Date.now()) / 1000));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (quoteId) fetchQuote(); }, [quoteId]);

  useEffect(() => {
    if (!quote) return;

    const id = setInterval(() => {
      setSecs((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [quote]);

  const handleCommit = async () => {
    if (!quote) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Payment session:", data.paymentSession);
      alert("Quote committed! (mock payment session logged)");
    } catch (err) {
      console.error(err);
      alert("Failed to commit quote");
    } finally {
      setLoading(false);
    }
  };

  if (!quote) return <p>Loading quote...</p>;

  const feeTotal = (quote.fees.platform ?? 0) + (quote.fees.network ?? 0);

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Quote Details</h1>

      <Card className="space-y-4">
        <div className="flex justify-between">
          <span>Rate</span>
          <span>${quote.rate.toLocaleString()} / {quote.asset.symbol}</span>
        </div>
        <div className="flex justify-between">
          <span>You Pay</span>
          <span>${quote.amtFiat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>You Receive</span>
          <span>{quote.amtCrypto.toFixed(6)} {quote.asset.symbol}</span>
        </div>
        <div className="flex justify-between">
          <span>Fees</span>
          <span>${feeTotal.toFixed(2)}</span>
        </div>
        <div className={`text-sm ${secs <= 10 ? "text-amber-500" : "text-gray-600"}`}>
          {secs > 0 ? `Expires in ${secs}s` : "Expired"}
        </div>

        <Button onClick={handleCommit} disabled={loading || secs <= 0}>
          {loading ? "Processing..." : "Confirm & Pay"}
        </Button>
      </Card>
    </section>
  );
}
