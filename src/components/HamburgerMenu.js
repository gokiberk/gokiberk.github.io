'use client';

import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';

export const HamburgerMenu = ({ isOpen, onClick }) => {
  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4 shadow-sm">
      <button
        onClick={onClick}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <Link href="/" className="ml-4">
        <span className="font-semibold text-gray-900">Gökberk Keskinkılıç</span>
      </Link>
    </header>
  );
}; 