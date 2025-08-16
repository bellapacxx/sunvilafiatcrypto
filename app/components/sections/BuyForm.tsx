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

// QuoteInfoCard - slate theme compatible
const QuoteInfoCard: React.FC<QuoteInfoCardProps> = ({ label, value, color }) => (
  <div className="relative p-4 sm:p-5 bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center justify-center transform transition-transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl">
    <span className="text-sm sm:text-base text-slate-300 mb-1">{label}</span>
    <span className={`text-lg sm:text-xl font-bold ${color}`}>{value}</span>
    <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 via-slate-400 to-indigo-500 rounded-full opacity-20 blur-3xl pointer-events-none" />
  </div>
);

// TimerBar - slate theme compatible
const TimerBar: React.FC<TimerBarProps> = ({ timeLeft, totalTime = 30 }) => {
  const timeLeftPercentage = (timeLeft / totalTime) * 100;
  let barColor = "bg-cyan-500";
  if (timeLeft < 10) {
    barColor = "bg-red-500";
  } else if (timeLeft < 20) {
    barColor = "bg-yellow-400";
  }

  return (
    <div className="space-y-2">
      <div className="text-center text-slate-300 font-mono font-bold text-base sm:text-lg tracking-wide">
        Quote expires in: {timeLeft}s
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden shadow-inner">
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
<div className="w-full max-w-sm mx-auto p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/20 rounded-3xl shadow-2xl relative flex flex-col space-y-5 overflow-visible">
  {/* Neon Top Line */}
  <div className="absolute top-2 left-0 w-full h-1.5 rounded-t-2xl bg-cyan-600 animate-gradient-x shadow-md" />

  {/* Header */}
  <div className="flex items-center space-x-2 z-10 mb-2">
    {step > 0 && (
      <button
        onClick={() => setStep(step - 1)}
        className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 shadow hover:shadow-cyan-400/50"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    )}
  </div>

  {/* Steps */}
  <div className="flex-1 flex flex-col justify-between w-full overflow-visible space-y-5">

    {/* Step 0: Select Token */}
    {step === 0 && (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <span className="text-lg font-bold text-cyan-400">Buy</span>

          <div className="flex items-center space-x-3 relative">
            {ASSETS.slice(0, 3).map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleFormChange("assetId", asset.id)}
                className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-300 ${
                  form.assetId === asset.id
                    ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-400/50"
                    : "border-slate-600 hover:border-slate-400 hover:scale-105 hover:shadow-md"
                }`}
              >
                <span className="text-sm text-white font-semibold">{asset.symbol}</span>
              </div>
            ))}

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-9 px-4 rounded-2xl bg-cyan-600 text-white font-medium text-sm flex-shrink-0 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-md"
            >
              Select Token
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 right-0 w-44 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl z-50 flex flex-col max-h-52 overflow-y-auto border border-slate-700">
                {ASSETS.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      handleFormChange("assetId", asset.id);
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 text-white text-sm hover:bg-slate-700 text-left rounded-t-lg last:rounded-b-lg transition-colors"
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
          className={`h-12 w-full rounded-2xl text-white font-semibold text-sm transition-all duration-300 ${
            form.assetId
              ? "bg-cyan-600 hover:scale-105 hover:brightness-110 shadow-lg"
              : "bg-slate-800 cursor-not-allowed"
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
          <label className="text-xs text-slate-400 font-medium">Amount</label>
          <AmountInput
            value={form.amount}
            onChange={(v: string) => handleFormChange("amount", v)}
            currency={currentCountryCurrency}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs text-slate-400 font-medium">Country</label>
          <Select
            options={COUNTRIES.map((c) => ({ id: c.id, label: c.label }))}
            value={form.country}
            onChange={(v: string) => handleFormChange("country", v)}
          />
        </div>

        <button
          onClick={() => setStep(2)}
          disabled={!form.amount || Number(form.amount) <= 0}
          className="w-full py-3 text-sm font-bold text-white bg-cyan-600 hover:from-cyan-500 hover:via-slate-500 hover:to-indigo-600 shadow-lg rounded-2xl transition-all duration-300"
        >
          Continue
        </button>
      </div>
    )}

    {/* Step 2: Payment Method */}
    {step === 2 && (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs text-slate-400 font-medium">Payment Method</label>
          <Select
            options={PAYMENT_METHODS.map((p) => ({ id: p.id, label: p.label }))}
            value={form.paymentMethod}
            onChange={(v: string) => handleFormChange("paymentMethod", v)}
          />
        </div>

        <button
          onClick={getQuote}
          disabled={loading || !form.assetId || !form.amount || !form.country || !form.paymentMethod}
          className="w-full py-3 text-sm font-bold text-white bg-cyan-600 hover:from-cyan-500 hover:via-slate-500 hover:to-indigo-600 shadow-lg rounded-2xl transition-all duration-300"
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    )}

    {/* Step 3: Confirm & Pay */}
{step === 3 && quote && (
  <div className="flex flex-col space-y-4">
    <div className="grid grid-cols-1 gap-3">
      <QuoteInfoCard
        label="You Pay"
        value={`${quote.fiat} ${quote.amtFiat.toFixed(2)}`}
        color="text-cyan-400"
      />
      <QuoteInfoCard
        label="You Receive"
        value={`${quote.amtCrypto.toFixed(6)} ${selectedAsset?.symbol}`}
        color="text-cyan-400"
      />
      <QuoteInfoCard
        label="Rate"
        value={`1 ${selectedAsset?.symbol} = ${quote.fiat} ${quote.rate.toLocaleString()}`}
        color="text-cyan-400"
      />
      <QuoteInfoCard
        label="Fees"
        value={`${(quote.fees.platform + quote.fees.network).toFixed(2)} ${quote.fiat}`}
        color="text-cyan-400"
      />
    </div>

    <TimerBar
      timeLeft={timeLeft}
      totalTime={30}
      // Optional: add internal gradient for slate theme
    />

    {error && (
      <p className="text-xs text-red-400 text-center font-semibold drop-shadow-md">
        {error}
      </p>
    )}

    <button
      onClick={commitQuote}
      disabled={loading || timeLeft <= 0}
      className="w-full py-3 text-sm font-bold text-white bg-cyan-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg rounded-2xl transition-all duration-300 hover:scale-105"
    >
      {loading ? "Processing..." : "Confirm & Pay"}
    </button>
  </div>
)}

  </div>
</div>



  );
}