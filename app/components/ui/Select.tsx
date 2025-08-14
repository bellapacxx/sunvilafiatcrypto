"use client";

import React from "react";

interface Option {
  id: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function Select({ options, value, onChange, disabled = false }: SelectProps) {
  return (
    <select
      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
