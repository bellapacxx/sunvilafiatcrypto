"use client";

import { motion } from "framer-motion";
import BuyForm from "./components/sections/BuyForm";

export default function HomePage() {
  return (
   <section className="max-w-5xl mx-auto px-4 pt-16 sm:pt-20 pb-8 sm:pb-20 text-center">
  {/* Hero Title */}
  <motion.h1
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-cyan-600 leading-tight mt-6"
  >
    Buy Crypto with Fiat – Fast & Secure
  </motion.h1>

  {/* Subheading */}
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    className="mt-4 text-base sm:text-lg md:text-xl text-gray-500 max-w-xl mx-auto"
  >
    Start your purchase in seconds. No sign-up. No KYC (for now).
  </motion.p>

  {/* Buy Form */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.6 }}
    className="mt-2 px-2 sm:px-0"
  >
    <BuyForm />
  </motion.div>
</section>

  );
}
