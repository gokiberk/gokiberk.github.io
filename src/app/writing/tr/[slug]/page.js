import { getWritingEntryBySlug, getAllWritingEntriesMetadata } from '@/lib/writing';
import WritingEntryClient from '@/components/WritingEntryClient';
import allUrls from '@/data/allUrls.json'; // Import allUrls

export default async function WritingEntryPageTR({ params }) {
  const slug = params.slug;
  const lang = 'tr';

  // Find the contentId for the current Turkish slug
  const contentId = Object.entries(allUrls).find(([id, urls]) => 
    urls.tr === slug
  )?.[0];

  // Fetch the specific entry data on the server
  const entry = getWritingEntryBySlug(slug, lang);

  // Fetch the list of all entries metadata for the sidebar on the server
  const allEntriesMetadata = getAllWritingEntriesMetadata();

  // Handle case where entry is not found
  if (!entry) {
    return <div>İçerik bulunamadı</div>;
  }

  return (
    <WritingEntryClient
      entry={entry}
      allEntriesMetadata={allEntriesMetadata}
      lang={lang}
      contentId={contentId}
      allUrls={allUrls} // Pass allUrls
    />
  );
} 