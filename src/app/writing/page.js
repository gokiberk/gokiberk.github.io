'use client';

import { SideMenu } from "@/components/SideMenu";
import { PageTitle } from "@/components/PageTitle";
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for navigation links

// Mock data for writing entries
const writingEntries = [
  {
    slug: 'building-mini-itx-pc',
    title: 'Building a Mini-ITX PC with Teenage Engineering Computer-1 and Apple Studio Display',
    date: 'May 21, 2024',
  },
  {
    slug: 'first-week-in-brazil',
    title: 'First week in Brazil...',
    date: 'April 15, 2024',
  },
  {
    slug: 'optimizing-website-speed',
    title: 'Optimizing Website Speed with Preload, Prefetch, Preconnect, and DNS Prefetch',
    date: 'December 04, 2023',
  },
  {
    slug: 'germany-to-holland',
    title: 'Germany to Holland - A Moving Story',
    date: 'October 06, 2023',
  },
  {
    slug: '2023-year-in-review',
    title: '2023 - Year in Review',
    date: 'January 01, 2024',
  },
];

export default function Writing() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for the main SideMenu collapse

  const handleResize = () => {
    const mobile = window.innerWidth < 1300;
    setIsMobile(mobile);
    // On desktop, we want the sidebar to be open by default on this page
    // SideMenu component now handles its own collapse based on screen size, so we don't need to set it here based on mobile state.
  };

  useEffect(() => {
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize); // Listen for resize events
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  // This toggleMenu is primarily for the mobile header hamburger icon
  const toggleMenu = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      {/* SideMenu handles its own responsiveness and positioning */}
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleMenu} // Pass toggle for mobile header
      />

      {/* Article Navigation (Desktop Only) */}
      {!isMobile && (
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-16 hidden md:block">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Writing Entries</h3>
            <ul>
              {writingEntries.map((entry) => (
                <li key={entry.slug} className="mb-3 last:mb-0">
                  <Link href={`/writing/${entry.slug}`} className="block group">
                    <p className="text-gray-800 group-hover:text-blue-600 transition-colors duration-200 font-medium">{entry.title}</p>
                    <p className="text-gray-500 text-sm">{entry.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}

      {/* Main Article Content */}
      {/* Remove ml-* classes here as the sidebar and article nav provide the offset */}
      {/* pt-16 for mobile header offset, md:pt-0 removes it on desktop */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300">
        {/* Content Wrapper to center and limit width */}
        <div className="p-4 md:p-8 lg:p-12 max-w-[800px] mx-auto">
          {/* Placeholder Title (e.g., from frontmatter) */}
          <h1 className="text-4xl font-extrabold mb-4">Building a Mini-ITX PC with Teenage Engineering Computer-1 and Apple Studio Display</h1>

          {/* Placeholder Featured Image */}
          <img src="/path/to/your/featured-image.jpg" alt="Featured Image" className="w-full rounded-lg mb-6" /> {/* Replace with actual image path */}

          {/* Placeholder Date */}
          <p className="text-gray-600 text-sm mb-6">May 21, 2024</p>

          {/* Placeholder Content (H1 and first paragraph) */}
          <h2 className="text-2xl font-bold mb-4">Section Title (H1 Placeholder)</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            This is the first paragraph of the article content. It will be replaced with actual content from your writing entries.
            The layout is now set up to display the main elements of a blog post or article.
          </p>

          {/* Add more content here later (paragraphs, images, etc.) */}

        </div>
      </main>
    </div>
  );
}