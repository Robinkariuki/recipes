'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Browse Meals', href: '/' },
  { name: 'Meal Planner', href: '/meal-planner' },
  // { name: 'Highlight', href: '/highlight' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">
              MealMate
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-pink-600 dark:text-pink-400 underline underline-offset-4'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900 shadow-inner dark:shadow-none transition-colors">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block text-base font-medium transition-colors ${
                pathname === item.href
                  ? 'text-pink-600 dark:text-pink-400 underline'
                  : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
