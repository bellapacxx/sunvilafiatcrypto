"use client";

import BuyForm from "../components/sections/BuyForm";

export default function BuyPage() {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Buy Crypto Instantly
      </h1>

      <BuyForm />
    </section>
  );
}
