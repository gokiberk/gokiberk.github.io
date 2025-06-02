'use client';

import { SideMenu } from "@/components/SideMenu";
import { PageTitle } from "@/components/PageTitle";
import Img from 'next/image';
import { useState, useEffect } from 'react';

export default function Gallery() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1300);
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
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleMenu}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300 md:ml-64">
        <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
          <PageTitle title="Gallery" className="lg hidden" />

          {/* Full Card Section */}
          <div className="bg-gradient-to-b from-white-900 via-black-700 to-white-500 text-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
            {/* Title Section */}
            <h1 className="text-3xl font-extrabold text-black text-center mb-6">
              Waiting for my lab to develop some photos...
            </h1>
            <div className="flex justify-center m-4">
              <Img
                src="/gallery/engagement.jpg"
                alt="Photography"
                width={800}
                height={1200}
                className="animate-reveal"
                nopin="nopin"
              />
            </div>
            <div className="flex justify-center m-4">
              <Img
                src="/gallery/erdemesiee.jpg"
                alt="Photography"
                width={800}
                height={1200}
                className="animate-reveal"
                nopin="nopin"
              />
            </div>
            <div className="flex justify-center m-4">
              <Img
                src="/gallery/balat.jpg"
                alt="Photography"
                width={800}
                height={1200}
                className="animate-reveal"
                nopin="nopin"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
