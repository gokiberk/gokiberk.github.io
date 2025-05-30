import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import allUrls from '../data/allUrls.json';

export default function WritingListClient({ entries }) {
  const [filteredEntries, setFilteredEntries] = useState([]);
  const pathname = usePathname();
  const isTurkishPage = pathname.startsWith('/writing/tr');

  useEffect(() => {
    // Filter entries based on the current language
    const filtered = entries.filter(entry => {
      const contentId = entry.contentId;
      const hasTranslation = allUrls[contentId]?.tr;
      return isTurkishPage ? hasTranslation : true;
    });
    setFilteredEntries(filtered);
  }, [entries, isTurkishPage]);

  return (
    <div className="space-y-4">
      {filteredEntries.map(entry => {
        const contentId = entry.contentId;
        const translationSlug = isTurkishPage ? allUrls[contentId]?.tr : null;
        const link = isTurkishPage ? `/writing/tr/${translationSlug}` : `/writing/${entry.slug}`;
        return (
          <div key={entry.slug} className="border-b pb-2">
            <Link href={link} className="text-blue-500 hover:underline">
              {entry.title}
            </Link>
            {translationSlug && (
              <span className="ml-2 text-sm text-gray-500">(Translation available)</span>
            )}
          </div>
        );
      })}
    </div>
  );
} 