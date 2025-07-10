'use client';

import { SideMenu } from "@/components/SideMenu";
import { PageTitle } from "@/components/PageTitle";
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Travel() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleResize = () => {
    const mobile = window.innerWidth < 1300;
    setIsMobile(mobile);
    // SideMenu component handles its own collapse based on screen size
  };

  useEffect(() => {
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize); // Listen for resize events
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  const toggleMenu = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <>
      <Head>
        <title>Travel | Gökberk Keskinkılıç</title>
        <meta name="description" content="Travel updates and adventures by Gökberk Keskinkılıç." />
        <meta property="og:title" content="Travel | Gökberk Keskinkılıç" />
        <meta property="og:description" content="Travel updates and adventures by Gökberk Keskinkılıç." />
        <meta property="og:image" content="/img/og-gokiberk.webp" />
        <link rel="canonical" href="https://gokiberk.com/travel" />
      </Head>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <SideMenu
          isMobile={isMobile}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleMenu}
        />

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300 ${
           !isMobile ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : ''
        }`}>
          <div className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto"> {/* Adjusted padding and max-width for consistency */}
            <PageTitle title="Travel" className="lg hidden" /> {/* Corrected title */}

            {/* Full Card Section - kept original styling for now */}
            <div className="bg-gradient-to-b from-blue-900 via-black-700 to-blue-500 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
              {/* Title Section */}
              <h1 className="text-3xl font-extrabold">
                Still travelling, will update once I'm back!
              </h1>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}