'use client';

import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for toggle button
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
      } h-screen bg-gray-50 border-r border-gray-200 flex flex-col transition-width duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={toggleMenu}
          className="text-gray-600 hover:text-indigo-500 focus:outline-none"
        >
          {isExpanded ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* User Profile */}
      <Link href="/" className={`flex items-center ${isExpanded ? 'gap-3 p-4' : 'justify-center p-2'}`}>
        {isExpanded ? (
          <>
            <img
              src="/img/headshot.png"
              alt="Gökberk Keskinkılıç"
              width={50}
              height={50}
              className="rounded-full border shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight">Gökberk Keskinkılıç</span>
              <span className="text-sm text-gray-600">Software Engineer</span>
            </div>
          </>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-indigo-500 text-white font-bold rounded-full">
            GK
          </div>
        )}
      </Link>

      {/* Navigation Links */}
      <nav className={`flex flex-col ${isExpanded ? 'gap-2' : 'items-center gap-4'}`}>
        {LINKS.map((link) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            label={isExpanded ? link.label : ''}
            icon={link.icon}
          />
        ))}
      </nav>

      {/* Divider */}
      {isExpanded && <hr className="my-4" />}

      {/* Online Profiles Section */}
      {isExpanded && (
        <div>
          <span className="text-xs font-medium text-gray-600 uppercase px-4">Online</span>
          <div className="flex flex-col gap-2 mt-2 px-4">
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
    </aside>
  );
};
