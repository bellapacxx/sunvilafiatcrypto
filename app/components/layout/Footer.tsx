"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        {/* Left */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SunvilaCoin. All rights reserved.
        </p>

        {/* Right */}
        <p className="text-sm">
          Powered by <span className="text-indigo-400 font-semibold">Next.js</span>
        </p>
      </div>

      {/* Optional neon accent line */}
      <div className="w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-pulse mt-2" />
    </footer>
  );
}
