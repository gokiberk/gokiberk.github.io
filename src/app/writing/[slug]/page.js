// Remove 'use client';

// Remove unused imports for useState, useEffect, use as useReact, Link

import { getWritingEntryBySlug, getAllWritingEntriesMetadata } from '@/lib/writing'; // Import server-side data fetching
import WritingEntryClient from '@/components/WritingEntryClient'; // Import the client component
import allUrls from '@/data/allUrls.json';
import BlogHeadComponent from '@/components/BlogHeadComponent'; // Import BlogHeadComponent

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

  // Handle case where entry is not found (e.g., invalid slug)
  if (!entry) {
    // In a Server Component, you can return a 404 page or specific UI
    return <div>Entry not found</div>; // Or redirect to a 404 page
  }

  // Assuming excerpt, dateISO, and featuredImage are part of entry data
  const metaDescription = entry.metaDescription;
  const metaTitle = entry.metaTitle;
  const datePublished = entry.dateISO;
  const dateModified = entry.dateISO; // Use published date as modified if no separate modified date

  // Pass fetched data to the Client Component for rendering and interactivity
  return (
    <>
      <BlogHeadComponent
        title={entry.title}
        metaDescription={metaDescription}
        metaTitle={metaTitle}
        slug={slug}
        language={lang}
        pageType="blog"
        siteName="My Blog" // Replace with your site name
        contentId={contentId}
        datePublished={datePublished}
        dateModified={dateModified}
        featuredImage={entry.featuredImage} // Assuming featuredImage is in entry data
        imageAlt={entry.title} // Use title as image alt if no specific alt is available
        baseUrl="https://gokiberk.com" // Replace with your base URL
        twitterHandle="@yourtwitter" // Replace with your twitter handle
        authorName="Gokiberk" // Replace with your author name
        authorUrl="https://gokiberk.com" // Replace with your author URL
        authorImage="/img/author.jpg" // Replace with your author image path
        // Add other relevant props if available in entry: tags, category, readingTime, excerpt
      />
      <WritingEntryClient
        entry={entry}
        allEntriesMetadata={allEntriesMetadata}
        lang={lang}
        contentId={contentId}
        allUrls={allUrls}
      />
    </>
  );
} 