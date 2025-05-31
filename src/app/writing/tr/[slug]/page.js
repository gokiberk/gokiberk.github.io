import { getWritingEntryBySlug, getAllWritingEntriesMetadata } from '@/lib/writing';
import WritingEntryClient from '@/components/WritingEntryClient';
import allUrls from '@/data/allUrls.json'; // Import allUrls
import BlogHeadComponent from '@/components/BlogHeadComponent'; // Import BlogHeadComponent

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

   // Assuming excerpt, dateISO, and featuredImage are part of entry data
  const metaDescription = entry.excerpt || (entry.content && entry.content[0]?.text) || 'Read this interesting article on my blog.';
  const datePublished = entry.dateISO;
  const dateModified = entry.dateISO; // Use published date as modified if no separate modified date

  return (
    <>
      <BlogHeadComponent
        title={entry.title}
        metaDescription={metaDescription}
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
        allUrls={allUrls} // Pass allUrls
      />
    </>
  );
} 