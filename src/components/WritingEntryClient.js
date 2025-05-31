'use client';

import { SideMenu } from "@/components/SideMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import allUrls from '@/data/allUrls.json';

export default function WritingEntryClient({ entry, allEntriesMetadata, lang, contentId, allUrls }) {
  const pathname = usePathname();
  const isTurkish = lang === 'tr';
  const currentSlug = pathname.split('/').pop();

  // Filter entries by current language and sort by dateISO from newest to oldest for navigation
  const sortedLanguageEntries = allEntriesMetadata
    .filter(item => item.language === lang)
    .sort((a, b) => {
      if (!a.dateISO || !b.dateISO) return 0;
      return b.dateISO.localeCompare(a.dateISO);
    });

  // Find the index of the current entry in the sorted language-specific list
  const currentEntryIndex = sortedLanguageEntries.findIndex(item => item.slug === currentSlug);

  // Determine previous and next entries within the same language
  const previousEntry = currentEntryIndex > 0 ? sortedLanguageEntries[currentEntryIndex - 1] : null;
  const nextEntry = currentEntryIndex < sortedLanguageEntries.length - 1 ? sortedLanguageEntries[currentEntryIndex + 1] : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Wrapper for Article Navigation and Main Content */}
      <div className="flex flex-1 flex-col md:flex-row md:ml-64">
        {/* Article Navigation (Desktop Only) */}
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-16 hidden md:block sticky top-0 h-screen hover:overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">{isTurkish ? 'Yazılar' : 'Writing Entries'}</h3>
            <ul>
              {/* Sidebar should still show all entries, filtered by the language of the main page */}
              {allEntriesMetadata
                .filter(item => isTurkish ? item.language === 'tr' : item.language === 'en')
                .sort((a, b) => {
                    if (!a.dateISO || !b.dateISO) return 0;
                    return b.dateISO.localeCompare(a.dateISO);
                })
                .map((item) => (
                <li key={item.slug} className="mb-3 last:mb-0">
                  <Link 
                    href={item.language === 'en' ? `/writing/${item.slug}` : `/writing/${item.language}/${item.slug}`} 
                    className="block group"
                  >
                    <p className="text-gray-800 group-hover:text-blue-600 transition-colors duration-200 font-medium">
                      {item.title}
                    </p>
                    <p className="text-gray-500 text-sm">{item.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto md:pt-8 transition-all duration-300" style={{ pointerEvents: 'none' }}>
          <div className="p-4 md:p-8 lg:p-12 max-w-[800px] mx-auto">
            {/* Language Switcher */}
            <div className="flex justify-end mb-4" style={{ pointerEvents: 'auto' }}>
              <LanguageSwitcher contentId={contentId} allUrls={allUrls} />
            </div>

            {/* Article Navigation Links */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-sm font-medium" style={{ pointerEvents: 'auto' }}>
                {previousEntry ? (
                    <Link 
                        href={previousEntry.language === 'en' ? `/writing/${previousEntry.slug}` : `/writing/${previousEntry.language}/${previousEntry.slug}`} 
                        className="text-gray-600 hover:text-gray-900 mb-2 sm:mb-0"
                    >
                        ← {previousEntry.title}
                    </Link>
                ) : (
                    <span className="text-gray-400 mb-2 sm:mb-0"></span>
                )}
                <Link 
                    href={isTurkish ? '/writing/tr' : '/writing'}
                    className="text-gray-600 hover:text-gray-900 underline mb-2 sm:mb-0 md:hidden"
                >
                    {isTurkish ? 'Tüm Yazılar' : 'All Writing'}
                </Link>
                {nextEntry ? (
                    <Link 
                         href={nextEntry.language === 'en' ? `/writing/${nextEntry.slug}` : `/writing/${nextEntry.language}/${nextEntry.slug}`} 
                        className="text-gray-600 hover:text-gray-900"
                    >
                        {nextEntry.title} →
                    </Link>
                ) : (
                    <span className="text-gray-400"></span>
                )}
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