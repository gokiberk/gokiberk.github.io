'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationLink } from '@/components/NavigationLink';
import { PROFILES, LINKS } from '@/lib/constants';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import Image from 'next/image';

export const SideMenu = () => {
  const [isMobile, setIsMobile] = useState(false); // Track if the screen is small
  const [isCollapsed, setIsCollapsed] = useState(false); // Track sidebar collapse state (used for mobile)

  // Function to handle screen resizing - Use md breakpoint (768px) for mobile detection
  const handleResize = () => {
    const mobile = window.innerWidth < 768; // Change breakpoint to 768px
    setIsMobile(mobile);
    // On desktop (not mobile), sidebar is always open
    if (!mobile) {
        setIsCollapsed(false); // Ensure isCollapsed is false on desktop
    } else {
        // On mobile, sidebar is collapsed by default
        setIsCollapsed(true);
    }
  };

  useEffect(() => {
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize); // Listen for resize events
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  const toggleMenu = () => setIsCollapsed(!isCollapsed); // Toggle collapse state (only used for mobile hamburger)

  return (
    <>
      {/* Sidebar */}
      {/* Show sidebar from md breakpoint (768px) upwards */}
      <aside
        className={`fixed bg-gray-50 flex flex-col transform transition-transform duration-300 z-40 
          ${isMobile
            ? // Mobile styles: bottom slide-up menu, collapsed by default
              `bottom-0 inset-x-0 border-t border-gray-200 max-h-[90vh] overflow-y-auto rounded-t-lg ${isCollapsed ? 'translate-y-full' : ''}`
            : // Desktop styles: always visible on the left, fixed width
              `top-0 left-0 h-screen border-r border-gray-200 w-64`
          }
        `}
      >
        {/* User Profile */}
        {/* Show profile details on desktop, hidden on mobile sidebar when collapsed */}
        <div className={`flex items-center p-4 w-full ${isMobile ? '' : 'flex-col'}`}>
          <Image
            src="/img/me.avif"
            alt="Gökberk Keskinkılıç"
            width={50}
            height={50}
            className="rounded-full border shadow-sm flex-shrink-0"
            priority
          />
          {/* Show text always on desktop, and on mobile sidebar when open */}
          {!isMobile ? (
             <div className={`flex flex-col ml-4 ${isMobile ? '' : 'mt-2 text-center ml-0'} flex-grow`}>
              <span className={`font-semibold tracking-tight ${isMobile ? 'text-left' : ''}`}>Gökberk Keskinkılıç</span>
              <span className={`text-sm text-gray-600 ${isMobile ? 'text-left' : ''}`}>Software Engineer</span>
            </div>
          ) : (
             !isCollapsed && (
               <div className={`flex flex-col ml-4 ${isMobile ? '' : 'mt-2 text-center ml-0'} flex-grow`}>
                <span className={`font-semibold tracking-tight ${isMobile ? 'text-left' : ''}`}>Gökberk Keskinkılıç</span>
                <span className={`text-sm text-gray-600 ${isMobile ? 'text-left' : ''}`}>Software Engineer</span>
              </div>
            )
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex flex-col gap-1 mt-4 w-full px-4 ${isMobile ? 'py-2' : ''}`}>
          {LINKS.map((link) => (
            <NavigationLink
              key={link.href}
              href={link.href}
              label={link.label} // Labels are always visible on desktop sidebar
              icon={link.icon}
              className={`px-2 py-2 hover:bg-gray-100 rounded-md ${!isMobile ? 'justify-start' : ''}`}
            />
          ))}
        </nav>

        {/* Divider */}
        {/* Show divider only on desktop */}
        {!isMobile && <hr className="my-4 w-full px-4" />}

        {/* Online Profiles Section */}
        <div className={`flex flex-col w-full px-4 ${isMobile ? 'py-2' : ''}`}>
          {!isMobile ? (
            // Desktop view: Always show full social links
            <>
              <span className="text-xs font-medium text-gray-600 uppercase">
                Social Accounts
              </span>
              <div className="flex flex-col gap-1 mt-2 w-full">
                {Object.values(PROFILES).map((profile) => (
                  <NavigationLink
                    key={profile.url}
                    href={profile.url}
                    label={profile.title} // Labels are always visible on desktop sidebar
                    icon={profile.icon}
                    className="px-2 py-2 hover:bg-gray-100 rounded-md justify-start"
                  />
                ))}
              </div>
            </>
          ) : (
            // Mobile view: Show social links in collapsed menu
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
        {/* Add padding at the bottom for mobile sidebar overflow */}
        {isMobile && <div className="pb-8"></div>}
      </aside>

      {/* Hamburger Menu (Header Button) - Only show on mobile */}
      {isMobile && <HamburgerMenu isOpen={!isCollapsed} onClick={toggleMenu} />}

      {/* Overlay for Mobile Menu - Only show on mobile when not collapsed */}
      {isMobile && !isCollapsed && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
        />
      )}
    </>
  );
};
