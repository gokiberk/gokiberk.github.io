'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationLink } from '@/components/NavigationLink';
import { PROFILES, LINKS } from '@/lib/constants';
import { HamburgerMenu } from '@/components/HamburgerMenu';

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
        className={`fixed bg-gray-50 flex flex-col transform transition-transform duration-300 z-40 ${
          isMobile
            ? `bottom-0 inset-x-0 border-t border-gray-200 max-h-[90vh] overflow-y-auto rounded-t-lg ${isCollapsed ? 'translate-y-full' : ''}`
            : `top-0 left-0 h-screen border-r border-gray-200 ${isCollapsed ? 'w-16' : 'w-64'}`
        }`}
      >
        {/* User Profile */}
        <div className={`flex items-center p-4 w-full ${isMobile ? '' : 'flex-col'}`}>
          <img
            src="/img/me.avif"
            alt="Gökberk Keskinkılıç"
            width={isMobile ? 50 : 50}
            height={isMobile ? 50 : 50}
            className="rounded-full border shadow-sm flex-shrink-0"
          />
          {(!isCollapsed || isMobile) && (
            <div className={`flex flex-col ml-4 ${isMobile ? '' : 'mt-2 text-center ml-0'} flex-grow`}>
              <span className={`font-semibold tracking-tight ${isMobile ? 'text-left' : ''}`}>Gökberk Keskinkılıç</span>
              <span className={`text-sm text-gray-600 ${isMobile ? 'text-left' : ''}`}>Software Engineer</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex flex-col gap-1 mt-4 w-full px-4 ${isMobile ? 'py-2' : ''}`}>
          {LINKS.map((link) => (
            <NavigationLink
              key={link.href}
              href={link.href}
              label={!isCollapsed ? link.label : ''}
              icon={link.icon}
              className={`px-2 py-2 hover:bg-gray-100 rounded-md ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            />
          ))}
        </nav>

        {/* Divider */}
        {!isMobile && <hr className="my-4 w-full px-4" />}

        {/* Online Profiles Section */}
        <div className={`flex flex-col w-full px-4 ${isMobile ? 'py-2' : ''}`}>
          {!isMobile ? (
            <>
              <span className="text-xs font-medium text-gray-600 uppercase">
                Social Accounts
              </span>
              <div className="flex flex-col gap-1 mt-2 w-full">
                {Object.values(PROFILES).map((profile) => (
                  <NavigationLink
                    key={profile.url}
                    href={profile.url}
                    label={!isCollapsed ? profile.title : ''}
                    icon={profile.icon}
                    className={`px-2 py-2 hover:bg-gray-100 rounded-md ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1 mt-2 w-full">
              {Object.values(PROFILES).map((profile) => (
                <NavigationLink
                  key={profile.url}
                  href={profile.url}
                  label={profile.title}
                  icon={profile.icon}
                  className="px-2 py-2 hover:bg-gray-100 rounded-md"
                />
              ))}
            </div>
          )}
        </div>
        <div className="pb-8"></div>
      </aside>

      {/* Hamburger Menu (Header Button) - Only show on mobile */}
      {isMobile && <HamburgerMenu isOpen={!isCollapsed} onClick={toggleMenu} />}

      {/* Overlay for Mobile Menu - Only show on mobile */}
      {isMobile && !isCollapsed && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
        />
      )}
    </>
  );
};
