'use client';

import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-pink-600">MyDashboard</span>
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <a href="#" className="text-gray-700 hover:text-pink-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-pink-600">About</a>
            <a href="#" className="text-gray-700 hover:text-pink-600">Contact</a>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <a href="#" className="block text-gray-700 hover:text-pink-600">Home</a>
          <a href="#" className="block text-gray-700 hover:text-pink-600">About</a>
          <a href="#" className="block text-gray-700 hover:text-pink-600">Contact</a>
        </div>
      )}
    </nav>
  );
}
