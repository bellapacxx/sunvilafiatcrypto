"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700 md:mt-10 fixed bottom-0 w-full md:relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        {/* Left */}
        <p className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} SunvilaCoin. All rights reserved.
        </p>

        {/* Right */}
        <p className="text-sm text-center md:text-right">
          Powered by <span className="text-indigo-400 font-semibold">SunvilaCoin</span>
        </p>
      </div>

      {/* Optional neon accent line */}
      <div className="w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-pulse mt-2" />
    </footer>
  );
}
