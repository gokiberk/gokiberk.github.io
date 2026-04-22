'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LanguageSwitcher({ contentId, allUrls }) {
  const pathname = usePathname();

  if (!contentId || !allUrls) return null;

  const currentLang =
    pathname === '/writing/tr'
      ? 'tr'
      : pathname === '/writing'
        ? 'en'
        : pathname.includes('/tr/')
          ? 'tr'
          : 'en';

  const availableLanguages = allUrls[contentId] || {};
  const languages = {
    en: contentId,
    ...availableLanguages,
  };

  return (
    <div className="flex gap-1" role="group" aria-label="Language switcher">
      {Object.entries(languages).map(([lang, slug]) => {
        const isCurrentLang = lang === currentLang;
        const href =
          contentId === 'writing'
            ? lang === 'en'
              ? '/writing'
              : '/writing/tr'
            : lang === 'en'
              ? `/writing/${slug}`
              : `/writing/${lang}/${slug}`;

        return (
          <Link
            key={lang}
            href={href}
            hrefLang={lang}
            aria-current={isCurrentLang ? 'page' : undefined}
            className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md transition-colors ${
              isCurrentLang
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {lang}
          </Link>
        );
      })}
    </div>
  );
}
