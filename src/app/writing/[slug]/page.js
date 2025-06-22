// Remove 'use client';

// Remove unused imports for useState, useEffect, use as useReact, Link

import { getWritingEntryBySlug, getAllWritingEntriesMetadata } from '@/lib/writing'; // Import server-side data fetching
import WritingEntryClient from '@/components/WritingEntryClient'; // Import the client component
import allUrls from '@/data/allUrls.json';
import { generateMetadata as generateBlogMetadata } from '@/components/BlogHeadComponent';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const lang = 'en';
  const contentId = Object.keys(allUrls).find(key => key === slug);

  const entry = getWritingEntryBySlug(slug, lang);

  if (!entry) {
    return {
      title: 'Entry Not Found',
      description: 'The requested entry could not be found.'
    };
  }

  const metaDescription = entry.metaDescription || entry.excerpt || (entry.content && entry.content[0]?.text) || 'Read this interesting article on my blog.';
  const datePublished = entry.dateISO;
  const dateModified = entry.dateISO;

  return generateBlogMetadata({
    title: entry.title,
    metaDescription,
    metaTitle: entry.metaTitle,
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

// This is now a Server Component
// Async function is needed to await data fetching
export default async function WritingEntryPage({ params }) {
  // In a Server Component, params is directly available (or will be a Promise handled by React.use implicitly by Next.js)
  const { slug } = params; // Access the slug directly from params
  const lang = 'en'; // Default to English

  // Find the contentId for the current English slug
  // In allUrls, the key is the English slug/contentId
  const contentId = Object.keys(allUrls).find(key => key === slug);

  // Fetch the specific entry data on the server
  const entry = getWritingEntryBySlug(slug, lang);

  // Fetch the list of all entries metadata for the sidebar on the server
  const allEntriesMetadata = getAllWritingEntriesMetadata();

  // Gather related blog entries (full data)
  let relatedBlogEntries = [];
  if (entry.relatedBlogs && entry.relatedBlogs.length > 0) {
    relatedBlogEntries = entry.relatedBlogs.map((relatedSlug) => {
      // Try to find the language for the related blog
      const relatedMeta = allEntriesMetadata.find(e => e.slug === relatedSlug);
      const relatedLang = relatedMeta ? relatedMeta.language : 'en';
      return getWritingEntryBySlug(relatedSlug, relatedLang);
    }).filter(Boolean);
  }

  // Handle case where entry is not found (e.g., invalid slug)
  if (!entry) {
    // In a Server Component, you can return a 404 page or specific UI
    return <div>Entry not found</div>; // Or redirect to a 404 page
  }

  // Assuming excerpt, dateISO, and featuredImage are part of entry data
  const title = entry.title;
  const metaDescription = entry.metaDescription;
  const metaTitle = entry.metaTitle;
  const datePublished = entry.dateISO;
  const dateModified = entry.dateISO; // Use published date as modified if no separate modified date

  // Pass fetched data to the Client Component for rendering and interactivity
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