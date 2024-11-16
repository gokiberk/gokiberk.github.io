'use client';

import { useState } from 'react';
import { FiMenu, FiChevronLeft } from 'react-icons/fi'; // Icons for toggle button
import Link from 'next/link';
import { NavigationLink } from '@/components/NavigationLink';
import { PROFILES, LINKS } from '@/lib/constants';

export const SideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Sidebar state

  const toggleMenu = () => setIsExpanded(!isExpanded); // Toggle sidebar state

  return (
    <aside
      className={`${
        isExpanded ? 'w-64' : 'w-16'
      } h-screen bg-gray-900 text-gray-200 border-r border-gray-800 flex flex-col transition-width duration-300 relative`}
    >
      {/* Collapse Button */}
      <button
        onClick={toggleMenu}
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-md focus:outline-none"
      >
        {isExpanded ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
      </button>

      {/* User Profile */}
      <Link
        href="/"
        className={`flex items-center ${
          isExpanded ? 'gap-3 p-4' : 'justify-center p-2'
        } hover:bg-gray-800 rounded-md`}
      >
        <img
          src="/img/headshot.png"
          alt="Gökberk Keskinkılıç"
          width={40}
          height={40}
          className="rounded-full"
        />
        {isExpanded && (
          <div>
            <p className="font-semibold">Gökberk Keskinkılıç</p>
          </div>
        )}
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col mt-4">
        {LINKS.map((link) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            label={isExpanded ? link.label : ''}
            icon={link.icon}
            isExpanded={isExpanded}
          />
        ))}
      </nav>

      {/* Online Profiles Section */}
      <div className="mt-auto">
        {isExpanded && (
          <div className="p-4">
            <p className="text-sm font-medium uppercase text-gray-400">Online</p>
            <div className="flex flex-col gap-2 mt-2">
              {Object.values(PROFILES).map((profile) => (
                <NavigationLink
                  key={profile.url}
                  href={profile.url}
                  label={profile.title}
                  icon={profile.icon}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
