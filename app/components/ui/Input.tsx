"use client";

import React from "react";

interface AmountInputProps {
  value: string;
  onChange: (v: string) => void;
  currency?: string; // e.g., USD, BTC
  placeholder?: string;
  disabled?: boolean;
}

export default function AmountInput({
  value,
  onChange,
  currency,
  placeholder = "0.00",
  disabled = false,
}: AmountInputProps) {
  return (
    <div className="flex items-center border rounded-lg overflow-hidden bg-white dark:bg-slate-800">
      {currency && (
        <div className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-200">
          {currency}
        </div>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-2 outline-none bg-transparent text-gray-900 dark:text-gray-100"
        aria-label={`Amount in ${currency || ""}`}
      />
    </div>
  );
}
