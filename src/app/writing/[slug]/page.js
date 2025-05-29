// Remove 'use client';

// Remove unused imports for useState, useEffect, use as useReact, Link

import { getWritingEntryBySlug, getAllWritingEntriesMetadata } from '@/lib/writing'; // Import server-side data fetching
import WritingEntryClient from '@/components/WritingEntryClient'; // Import the client component

// This is now a Server Component
// Async function is needed to await data fetching
export default async function WritingEntryPage({ params }) {
  // In a Server Component, params is directly available (or will be a Promise handled by React.use implicitly by Next.js)
  const { slug } = params; // Access the slug directly from params

  // Fetch the specific entry data on the server
  const entry = getWritingEntryBySlug(slug);

  // Fetch the list of all entries metadata for the sidebar on the server
  const allEntriesMetadata = getAllWritingEntriesMetadata();

  // Handle case where entry is not found (e.g., invalid slug)
  if (!entry) {
    // In a Server Component, you can return a 404 page or specific UI
    return <div>Entry not found</div>; // Or redirect to a 404 page
  }

  // Pass fetched data to the Client Component for rendering and interactivity
  return (
    <WritingEntryClient
      entry={entry}
      allEntriesMetadata={allEntriesMetadata}
    />
  );
} 