'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LanguageSwitcher({ contentId, allUrls }) {
  const pathname = usePathname();

  // Log the props to inspect the data being received
  console.log('LanguageSwitcher Props:', { contentId, allUrls });

  if (!contentId || !allUrls) return null;

  // Determine current language from pathname
  // Check for exact match for main writing pages
  const currentLang = pathname === '/writing/tr' ? 'tr' : pathname === '/writing' ? 'en' : pathname.includes('/tr/') ? 'tr' : 'en';

  // Get available languages for this content
  const availableLanguages = allUrls[contentId] || {};
  
  // Always include English version (contentId is the English slug)
  const languages = {
    en: contentId,
    ...availableLanguages
  };
  
  // Log the determined languages and currentLang
  console.log('Determined Languages:', languages);
  console.log('Current Language:', currentLang);

  return (
    <div className="flex gap-2">
      {Object.entries(languages).map(([lang, slug]) => {
        const isCurrentLang = lang === currentLang;
        // Special handling for main writing page
        const href = contentId === 'writing'
          ? lang === 'en' ? '/writing' : '/writing/tr'
          : lang === 'en' 
            ? `/writing/${slug}`
            : `/writing/${lang}/${slug}`;
        
        // Log the generated href for each button
        console.log(`Generated href for ${lang}: ${href}`);

        return (
          <Link 
            key={lang}
            href={href}
            className={`text-sm font-medium px-2 py-1 rounded ${
              isCurrentLang
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
} 