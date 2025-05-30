import { getWritingEntryBySlug, getAllWritingEntriesMetadata } from '@/lib/writing';
import WritingEntryClient from '@/components/WritingEntryClient';

export default async function WritingEntryPageTR({ params }) {
  const { slug } = params;
  const lang = 'tr';

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
    />
  );
} 