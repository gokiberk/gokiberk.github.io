'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationLink } from '@/components/NavigationLink';
import { PROFILES, LINKS } from '@/lib/constants';
import { FiMenu, FiX } from 'react-icons/fi';

export const SideMenu = () => {
  const [isMobile, setIsMobile] = useState(false); // Track if the screen is small
  const [isCollapsed, setIsCollapsed] = useState(false); // Track sidebar collapse state

  // Function to handle screen resizing
  const handleResize = () => {
    const mobile = window.innerWidth < 1300;
    setIsMobile(mobile);
    setIsCollapsed(mobile); // Collapse sidebar automatically for smaller screens
  };

  useEffect(() => {
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize); // Listen for resize events
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  const toggleMenu = () => setIsCollapsed(!isCollapsed); // Toggle collapse state

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-50 border-r border-gray-200 flex flex-col items-center transform transition-transform duration-300 z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* User Profile */}
        <Link href="/" className="flex flex-col items-center p-4">
          <img
            src="/img/headshot.png"
            alt="Gökberk Keskinkılıç"
            width={50}
            height={50}
            className="rounded-full border shadow-sm"
          />
          {!isCollapsed && (
            <div className="flex flex-col mt-2 text-center">
              <span className="font-semibold tracking-tight">Gökberk Keskinkılıç</span>
              <span className="text-sm text-gray-600">Software Engineer</span>
            </div>
          )}
        </Link>

        {/* Navigation Links */}
        <nav className={`flex flex-col gap-2 mt-4 ${!isCollapsed ? 'px-4' : 'px-2'}`}>
          {LINKS.map((link) => (
            <NavigationLink
              key={link.href}
              href={link.href}
              label={!isCollapsed ? link.label : ''}
              icon={link.icon}
            />
          ))}
        </nav>

        {/* Divider */}
        {!isCollapsed && <hr className="my-4 w-full" />}

        {/* Online Profiles Section */}
        <div className="flex flex-col items-center">
          {!isCollapsed ? (
            <>
              <span className="text-xs font-medium text-gray-600 uppercase px-4">
                Social Accounts
              </span>
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
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.values(PROFILES).map((profile) => (
                <NavigationLink
                  key={profile.url}
                  href={profile.url}
                  icon={profile.icon}
                />
              ))}
            </div>
          )}
        </div>

        {/* Toggle Button */}
        {isMobile && (
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-[-1.5rem] bg-gray-100 p-2 rounded-r-md shadow-md border border-gray-200 text-gray-700 z-50"
          >
            {isCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
          </button>
        )}
      </aside>

      {/* Overlay for Mobile Menu */}
      {isMobile && !isCollapsed && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
};
