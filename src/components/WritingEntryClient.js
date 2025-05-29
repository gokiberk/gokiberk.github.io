'use client';

import { SideMenu } from "@/components/SideMenu";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WritingEntryClient({ entry, allEntriesMetadata }) {
  // State for responsiveness and sidebar visibility
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for the main SideMenu collapse

  const handleResize = () => {
    const mobile = window.innerWidth < 1300;
    setIsMobile(mobile);
  };

  useEffect(() => {
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize); // Listen for resize events
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  const toggleMenu = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Note: Handle case where entry is null before rendering if needed, although it should be handled by the Server Component

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleMenu}
      />

      {/* Wrapper for Article Navigation and Main Content */}
      <div className={`flex flex-1 flex-col md:flex-row ${!isMobile ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
        {/* Article Navigation (Desktop Only) */}
        {!isMobile && (
          <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-16 hidden md:block">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Writing Entries</h3>
              <ul>
                {allEntriesMetadata.map((entryItem) => ( // Use passed metadata for the list
                  <li key={entryItem.slug} className="mb-3 last:mb-0">
                    <Link href={`/writing/${entryItem.slug}`} className="block group">
                      <p className="text-gray-800 group-hover:text-blue-600 transition-colors duration-200 font-medium">{entryItem.title}</p>
                      <p className="text-gray-500 text-sm">{entryItem.date}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* Main Article Content */}
        {/* pt-16 for mobile header offset, md:pt-0 removes it on desktop */}
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300">
          {/* Content Wrapper to center and limit width */}
          <div className="p-4 md:p-8 lg:p-12 max-w-[800px] mx-auto">
            {/* Article Title */}
            <h1 className="text-4xl font-extrabold mb-4">{entry.title}</h1>

            {/* Featured Image */}
            {entry.featuredImage && (
               <img src={entry.featuredImage} alt={entry.title} className="w-full rounded-lg mb-6" />
            )}

            {/* Article Date */}
            <p className="text-gray-600 text-sm mb-6">{entry.date}</p>

            {/* Article Content - Render blocks */}
            <div className="prose max-w-none">
              {entry.content.map((block, index) => (
                <div key={index}>
                  {block.type === 'h2' && <h2 className="text-2xl font-bold mb-4 mt-6">{block.text}</h2>}
                  {block.type === 'p' && <p className="text-gray-700 leading-relaxed mb-6">{block.text}</p>}
                  {/* Add more block types here as needed (e.g., 'img', 'code') */}
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
} 