'use client';

import { SideMenu } from "@/components/SideMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import allUrls from '@/data/allUrls.json';

export default function WritingEntryClient({ entry, allEntriesMetadata, lang, contentId, allUrls }) {
  const pathname = usePathname();
  const isTurkish = lang === 'tr';
  const slug = pathname.split('/').pop();

  // Find the current entry in allEntriesMetadata to check for translations
  const currentEntry = allEntriesMetadata.find(entry => entry.slug === slug);

  // Sort entries by dateISO from newest to oldest
  const sortedEntries = allEntriesMetadata
    .filter(entry => isTurkish ? entry.language === 'tr' : entry.language === 'en')
    .sort((a, b) => {
      if (!a.dateISO || !b.dateISO) return 0;
      return b.dateISO.localeCompare(a.dateISO);
    });

  // Check if this entry has a translation in the other language
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Wrapper for Article Navigation and Main Content */}
      <div className="flex flex-1 flex-col md:flex-row ml-64">
        {/* Article Navigation (Desktop Only) */}
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-16 hidden md:block sticky top-0 h-screen hover:overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">{isTurkish ? 'Yazılar' : 'Writing Entries'}</h3>
            <ul>
              {sortedEntries.map((entry) => (
                <li key={entry.slug} className="mb-3 last:mb-0">
                  <Link 
                    href={isTurkish ? `/writing/tr/${entry.slug}` : `/writing/${entry.slug}`} 
                    className="block group"
                  >
                    <p className="text-gray-800 group-hover:text-blue-600 transition-colors duration-200 font-medium">
                      {entry.title}
                    </p>
                    <p className="text-gray-500 text-sm">{entry.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300" style={{ pointerEvents: 'none' }}>
          <div className="p-4 md:p-8 lg:p-12 max-w-[800px] mx-auto">
            <div className="flex justify-end mb-4" style={{ pointerEvents: 'auto' }}>
              <LanguageSwitcher contentId={contentId} allUrls={allUrls} />
            </div>
            <h1 className="text-4xl font-extrabold mb-2">{entry.title}</h1>
            {entry.date && (
              <div className="text-gray-500 text-base mb-8">{entry.date}</div>
            )}
            {entry.featuredImage && (
              <img
                src={entry.featuredImage}
                alt={entry.title}
                className="w-full object-cover rounded-lg mb-8"
              />
            )}
            <div className="prose prose-lg max-w-none">
              {entry.content.map((block, index) => (
                <div key={index}>
                  {block.type === 'h1' && <h1 className="text-3xl font-bold mb-6 mt-8">{block.text}</h1>}
                  {block.type === 'h2' && <h2 className="text-2xl font-bold mb-4 mt-6">{block.text}</h2>}
                  {block.type === 'h3' && <h3 className="text-xl font-semibold mb-3 mt-5">{block.text}</h3>}
                  {block.type === 'p' && <p className="text-gray-700 leading-relaxed mb-6">{block.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 