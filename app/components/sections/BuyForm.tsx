"use client";

import { useState, useEffect } from "react";
import AmountInput from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";
import {
  DollarSign,
  CheckCheck,
  ArrowDown,
  ArrowLeft,
} from "lucide-react";

// Define an interface for the form state
interface FormState {
  assetId: string;
  amount: string;
  country: string;
  paymentMethod: string;
}

// Define interfaces for component props
interface QuoteInfoCardProps {
  label: string;
  value: string;
  color: string;
}

interface TimerBarProps {
  timeLeft: number;
  totalTime?: number;
}

interface Quote {
  id: string;
  rate: number;
  fiat: string;
  amtFiat: number;
  amtCrypto: number;
  fees: {
    platform: number;
    network: number;
  };
}

const QuoteInfoCard: React.FC<QuoteInfoCardProps> = ({ label, value, color }) => (
  <div className="relative p-4 sm:p-5 bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center justify-center transform transition-transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl">
    <span className="text-sm sm:text-base text-gray-300 mb-1">{label}</span>
    <span className={`text-lg sm:text-xl font-bold ${color}`}>{value}</span>
    <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl pointer-events-none" />
  </div>
);

const TimerBar: React.FC<TimerBarProps> = ({ timeLeft, totalTime = 30 }) => {
  const timeLeftPercentage = (timeLeft / totalTime) * 100;
  let barColor = "bg-green-500";
  if (timeLeft < 10) {
    barColor = "bg-red-500";
  } else if (timeLeft < 20) {
    barColor = "bg-yellow-500";
  }

  return (
    <div className="space-y-2">
      <div className="text-center text-yellow-400 font-mono font-bold text-base sm:text-lg tracking-wide">
        Quote expires in: {timeLeft}s
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${timeLeftPercentage}%` }}
        />
      </div>
    </div>
  );
};

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
  const [step, setStep] = useState(0); // 0: select token, 1: amount & country, 2: payment method, 3: confirm
  const [form, setForm] = useState<FormState>({
    assetId: "",
    amount: "",
    country: "us",
    paymentMethod: "card",
  });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [error, setError] = useState<string>("");
   const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFormChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getQuote = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: form.assetId,
          amountIn: "fiat",
          amount: Number(form.amount),
          country: form.country,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch quote.");
      }
      data.fiat =
        data.fiat ||
        COUNTRIES.find((c) => c.id === form.country)?.currency ||
        "USD";
      setQuote(data);
      setTimeLeft(30);
      setStep(3); // Go to confirmation step
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const commitQuote = async () => {
    if (!quote) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/quotes/${quote.id}/commit`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to commit quote.");
      }
      const data = await res.json();
      console.log("Payment session:", data.paymentSession);
      alert("Quote committed! Check console for mock session.");
    } catch (err) {
      console.error(err);
      setError("An error occurred during payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!quote || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [quote, timeLeft]);

  const currentCountryCurrency =
    COUNTRIES.find((c) => c.id === form.country)?.currency || "USD";
  const selectedAsset = ASSETS.find((a) => a.id === form.assetId);

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-gray-900/80 backdrop-blur-md border border-gray-700/30 rounded-2xl shadow-lg relative flex flex-col space-y-4">
  {/* Neon Top Line */}
  <div className="absolute top-0 left-0 w-full h-1 rounded-tl-2xl rounded-tr-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-pulse" />

  {/* Header */}
  <div className="flex items-center space-x-2 z-10">
    {step > 0 && (
      <button
        onClick={() => setStep(step - 1)}
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    )}
    
  </div>

  {/* Steps */}
  <div className="flex-1 flex flex-col justify-between w-full overflow-visible">
    {/* Step 0: Select Token */}
    {step === 0 && (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <span className="text-lg font-bold text-gray-300">Buy</span>
          <div className="flex items-center space-x-3 relative">
            {ASSETS.slice(0, 3).map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleFormChange("assetId", asset.id)}
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all ${
                  form.assetId === asset.id
                    ? "border-pink-500 scale-105"
                    : "border-transparent hover:border-gray-500 hover:scale-105"
                }`}
              >
                <span className="text-xs text-white font-semibold">{asset.symbol}</span>
              </div>
            ))}

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-8 px-3 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white font-medium text-sm flex-shrink-0"
            >
              Select Token
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 right-0 w-40 bg-gray-800 rounded-lg shadow-lg z-50 flex flex-col max-h-48 overflow-y-auto">
                {ASSETS.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      handleFormChange("assetId", asset.id);
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 text-white text-sm hover:bg-gray-700 text-left rounded-t-lg last:rounded-b-lg"
                  >
                    {asset.label} ({asset.symbol})
                  </button>
                ))}
              </div>
            )}
          </div>

          
        </div>

        <button
          onClick={() => form.assetId && setStep(1)}
          disabled={!form.assetId}
          className={`h-10 w-full rounded-full text-white font-medium text-sm transition-colors ${
            form.assetId ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:bg-pink-600" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Get Started
        </button>
      </div>
    )}

    {/* Step 1: Amount & Country */}
    {step === 1 && (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs text-gray-400 font-medium">Amount</label>
          <AmountInput
            value={form.amount}
            onChange={(v: string) => handleFormChange("amount", v)}
            currency={currentCountryCurrency}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs text-gray-400 font-medium">Country</label>
          <Select
            options={COUNTRIES.map((c) => ({ id: c.id, label: c.label }))}
            value={form.country}
            onChange={(v: string) => handleFormChange("country", v)}
          />
        </div>

        <Button
          onClick={() => setStep(2)}
          disabled={!form.amount || Number(form.amount) <= 0}
          className="w-full py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-600 hover:to-purple-600 shadow-md rounded-xl"
        >
          Continue
        </Button>
      </div>
    )}

    {/* Step 2: Payment Method */}
    {step === 2 && (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs text-gray-400 font-medium">Payment Method</label>
          <Select
            options={PAYMENT_METHODS.map((p) => ({ id: p.id, label: p.label }))}
            value={form.paymentMethod}
            onChange={(v: string) => handleFormChange("paymentMethod", v)}
          />
        </div>

        <Button
          onClick={getQuote}
          disabled={loading || !form.assetId || !form.amount || !form.country || !form.paymentMethod}
          className="w-full py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-600 hover:to-purple-600 shadow-md rounded-xl"
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </Button>
      </div>
    )}

    {/* Step 3: Confirm & Pay */}
    {step === 3 && quote && (
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <QuoteInfoCard
            label="You Pay"
            value={`${quote.fiat} ${quote.amtFiat.toFixed(2)}`}
            color="text-green-400"
          />
          <QuoteInfoCard
            label="You Receive"
            value={`${quote.amtCrypto.toFixed(6)} ${selectedAsset?.symbol}`}
            color="text-purple-400"
          />
          <QuoteInfoCard
            label="Rate"
            value={`1 ${selectedAsset?.symbol} = ${quote.fiat} ${quote.rate.toLocaleString()}`}
            color="text-indigo-400"
          />
          <QuoteInfoCard
            label="Fees"
            value={`${(quote.fees.platform + quote.fees.network).toFixed(2)} ${quote.fiat}`}
            color="text-red-400"
          />
        </div>

        <TimerBar timeLeft={timeLeft} />

        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <Button
          onClick={commitQuote}
          disabled={loading || timeLeft <= 0}
          className="w-full py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-green-600 hover:to-emerald-500 shadow-md rounded-xl"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </Button>
      </div>
    )}
  </div>
</div>


  );
}