import { getAllWritingEntriesMetadata } from '@/lib/writing';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

function generateSitemapXml(urls) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(entry => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
      <changefreq>${entry.changeFrequency}</changefreq>
      <priority>${entry.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

  return xml;
}

export async function GET() {
  const baseUrl = 'https://gokiberk.com';
  const entries = getAllWritingEntriesMetadata();

  // Create URLs for all writing entries and their translations
  const writingUrls = entries.flatMap(entry => {
    const urls = [
      {
        url: `${baseUrl}/writing/${entry.slug}`,
        lastModified: new Date(entry.date),
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    ];

    // Add Turkish translation URL if available
    if (entry.hasTranslation) {
      urls.push({
        url: `${baseUrl}/writing/tr/${entry.trSlug}`,
        lastModified: new Date(entry.date),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    return urls;
  });

  // Add static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const allUrls = [...staticPages, ...writingUrls];
  const xml = generateSitemapXml(allUrls);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 