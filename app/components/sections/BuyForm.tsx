"use client";

import { useState, useEffect } from "react";
import AmountInput from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";

const ASSETS = [
    { id: "svc", label: "SunvilaCoin", symbol: "SVC" },
  { id: "btc", label: "Bitcoin", symbol: "BTC" },
  { id: "eth", label: "Ethereum", symbol: "ETH" },
  { id: "usdc", label: "USDC", symbol: "USDC" },
];

const COUNTRIES = [
  { id: "us", label: "United States", currency: "USD" },
  { id: "ke", label: "Kenya", currency: "KES" },
  { id: "ng", label: "Nigeria", currency: "NGN" },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Card" },
  { id: "bank", label: "Bank Transfer" },
  { id: "mobile", label: "Mobile Money" },
];

export default function BuyForm() {
  const [assetId, setAssetId] = useState("svc");
  const [amount, setAmount] = useState("100");
  const [country, setCountry] = useState("us");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const getQuote = async () => {
    setLoading(true);
    try {
      const selectedCountry = COUNTRIES.find((c) => c.id === country);
      const selectedAsset = ASSETS.find((a) => a.id === assetId);
      const mockQuote = {
        id: "mock-" + Date.now(),
        asset: selectedAsset,
        amtFiat: Number(amount),
        amtCrypto: Number(amount) / 20000,
        rate: 20000,
        fees: { platform: 2, network: 1 },
        fiat: selectedCountry?.currency || "USD",
        expiresAt: new Date(Date.now() + 30_000).toISOString(),
      };
      setQuote(mockQuote);
      setTimeLeft(30);
    } finally {
      setLoading(false);
    }
  };

  const commitQuote = async () => {
    if (!quote) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/commit`, { method: "POST" });
      const data = await res.json();
      console.log("Payment session:", data.paymentSession);
      alert("Quote committed! Check console for mock session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quote || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [quote, timeLeft]);

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
  <Card className="relative bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-xl border border-gray-700/30 rounded-3xl shadow-2xl p-4 sm:p-6 space-y-6 overflow-hidden">
    {/* Neon Accent Lines <div className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 animate-pulse" /> */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-pulse" />
    

    {/* Form Section */}
    <div className="space-y-5">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">Buy Crypto</h2>

      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">Select Asset</label>
        <Select
          options={ASSETS.map((a) => ({ id: a.id, label: a.label }))}
          value={assetId}
          onChange={setAssetId}
        />
      </div>

      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">Amount</label>
        <AmountInput
          value={amount}
          onChange={setAmount}
          currency={COUNTRIES.find((c) => c.id === country)?.currency || "USD"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">Country</label>
          <Select
            options={COUNTRIES.map((c) => ({ id: c.id, label: c.label }))}
            value={country}
            onChange={setCountry}
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">Payment Method</label>
          <Select
            options={PAYMENT_METHODS.map((p) => ({ id: p.id, label: p.label }))}
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>
      </div>

      <Button
        onClick={getQuote}
        disabled={loading}
        className="w-full py-3 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-xl transition-all rounded-xl"
      >
        {loading ? "Loading..." : "Generate Quote"}
      </Button>
    </div>

    {/* Quote Section */}
    {quote && (
      <div className="mt-6 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Quote Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Rate", value: `${quote.fiat} ${quote.rate.toLocaleString()} / ${quote.asset.symbol}`, color: "text-indigo-400" },
            { label: "You Pay", value: `${quote.fiat} ${quote.amtFiat.toFixed(2)}`, color: "text-green-400" },
            { label: "You Receive", value: `${quote.amtCrypto.toFixed(6)} ${quote.asset.symbol}`, color: "text-purple-400" },
            { label: "Fees", value: `${quote.fees.platform + quote.fees.network}`, color: "text-red-400" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-4 sm:p-5 bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center justify-center transform transition-transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl"
            >
              <span className="text-sm sm:text-base text-gray-300 mb-1">{item.label}</span>
              <span className={`text-lg sm:text-xl font-bold ${item.color}`}>{item.value}</span>
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="text-center text-yellow-400 font-mono font-bold text-base sm:text-lg tracking-wide">
          Quote expires in: {timeLeft}s
        </div>

        <Button
          onClick={commitQuote}
          disabled={loading || timeLeft <= 0}
          className="w-full py-3 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 shadow-xl rounded-2xl transition-all transform hover:scale-[1.01]"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </Button>
      </div>
    )}
  </Card>
</div>

  );
}
