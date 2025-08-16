"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50 mb-10">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          SunvilaCoin
        </Link>

        {/* Right side: Links + Connect Wallet */}
        <div className="flex items-center gap-4">
          {/* Desktop Menu */}
          {/* Connect Wallet Button */}
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white font-semibold shadow-lg hover:from-yellow-500 hover:to-orange-700 transition-all duration-300 hover:scale-105">
            Connect Wallet
          </button>
          <ul className="hidden md:flex gap-6 text-lg font-medium text-gray-700">
            <li>
              <Link href="/buy">Buy</Link>
            </li>
            <li>
              <Link href="/wallet">Wallet</Link>
            </li>
          </ul>

          

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col gap-2 p-4 text-gray-700 font-medium">
            <li>
              <Link href="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/buy" onClick={toggleMenu}>
                Buy
              </Link>
            </li>
            <li>
              <Link href="/wallet" onClick={toggleMenu}>
                Wallet
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
