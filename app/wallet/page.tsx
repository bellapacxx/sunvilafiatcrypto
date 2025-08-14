"use client";

import WalletList from "../components/sections/WalletList";

export default function WalletPage() {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Wallets
      </h1>

      <WalletList />
    </section>
  );
}
