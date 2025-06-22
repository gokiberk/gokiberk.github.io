import { getWritingEntryBySlug, getAllWritingEntriesMetadata } from '@/lib/writing';
import WritingEntryClient from '@/components/WritingEntryClient';
import allUrls from '@/data/allUrls.json'; // Import allUrls
import { generateMetadata as generateBlogMetadata } from '@/components/BlogHeadComponent';

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const lang = 'tr';
  const contentId = Object.entries(allUrls).find(([id, urls]) => 
    urls.tr === slug
  )?.[0];

  const entry = getWritingEntryBySlug(slug, lang);

  if (!entry) {
    return {
      title: 'İçerik Bulunamadı',
      description: 'İstediğiniz içerik bulunamadı.'
    };
  }

  const metaDescription = entry.metaDescription;
  const metaTitle = entry.metaTitle;
  const title = entry.title;
  const datePublished = entry.dateISO;
  const dateModified = entry.dateISO;

  return generateBlogMetadata({
    title,
    metaDescription,
    metaTitle,
    slug,
    language: lang,
    pageType: "blog",
    siteName: "Gökberk Keskinkılıç",
    contentId,
    datePublished,
    dateModified,
    featuredImage: entry.featuredImage,
    imageAlt: entry.title,
    baseUrl: "https://gokiberk.com",
    twitterHandle: "@gokiberk",
    authorName: "Gökberk Keskinkılıç",
    authorUrl: "https://gokiberk.com",
    authorImage: "/img/author.jpg"
  });
}

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

  // Gather related blog entries (full data)
  let relatedBlogEntries = [];
  if (entry.relatedBlogs && entry.relatedBlogs.length > 0) {
    relatedBlogEntries = entry.relatedBlogs.map((relatedSlug) => {
      // Try to find the language for the related blog
      const relatedLang = 'tr';
      // Find the Turkish corresponding value for the given relatedSlug
      const trSlug = allUrls[relatedSlug]?.tr || relatedSlug;
      return getWritingEntryBySlug(trSlug, relatedLang);
    }).filter(Boolean);
  }

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
      allUrls={allUrls}
      relatedBlogEntries={relatedBlogEntries}
    />
  );
} 