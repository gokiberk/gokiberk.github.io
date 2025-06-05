import { Metadata } from 'next';

export function generateMetadata({
  title = 'My Personal Blog',
  metaDescription = 'Welcome to my personal blog where I share my thoughts, experiences, and adventures.',
  metaTitle,
  slug = '',
  language = 'en',
  pageType = "blog", // blog, homepage, page
  siteName = 'Gökberk Keskinkılıç',
  contentId = '',
  dateModified,
  datePublished,
  indexStatus = 'index',
  followStatus = 'follow',
  
  // Blog specific
  authorName = 'Your Name',
  authorUrl = '',
  authorImage = '/img/me.avif',
  
  // Content specific
  featuredImage = '/img/default-og.jpg',
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt = '',
  
  // Optional structured data
  faqData = [],
  tags = [],
  category = '',
  readingTime = '',
  
  // Site config
  baseUrl = 'https://gokiberk.com',
  twitterHandle = '@gokiberk',
  
  // Additional meta
  excerpt = ''
}) {
  // Generate canonical URL
  const canonicalUrl = slug 
    ? `${baseUrl}/writing${language === 'tr' ? '/tr' : ''}/${slug}`
    : baseUrl;
  
  // Set featured image URL
  const imageUrl = featuredImage.startsWith('http') 
    ? featuredImage 
    : `${baseUrl}${featuredImage}`;

  // Generate structured data for blog posts
  const generateSchemaData = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@graph': []
    };

    // Website Schema
    const websiteSchema = {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      url: baseUrl,
      name: siteName,
      description: metaDescription,
      inLanguage: language
    };

    // Author Schema
    const authorSchema = {
      '@type': 'Person',
      '@id': `${baseUrl}#author`,
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
      ...(authorImage && { 
        image: {
          '@type': 'ImageObject',
          url: authorImage.startsWith('http') ? authorImage : `${baseUrl}${authorImage}`
        }
      })
    };

    // WebPage Schema
    const webPageSchema = {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description: metaDescription,
      isPartOf: { '@id': `${baseUrl}#website` },
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified }),
      inLanguage: language,
      potentialAction: [{
        '@type': 'ReadAction',
        target: [canonicalUrl]
      }]
    };

    // BlogPosting Schema (for blog posts)
    if (pageType === 'blog' && contentId) {
      const blogPostSchema = {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#blogpost`,
        mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
        headline: title,
        description: excerpt || metaDescription,
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        author: { '@id': `${baseUrl}#author` },
        publisher: {
          '@type': 'Person',
          name: authorName,
          ...(authorImage && { 
            logo: {
              '@type': 'ImageObject',
              url: authorImage.startsWith('http') ? authorImage : `${baseUrl}${authorImage}`
            }
          })
        },
        image: {
          '@type': 'ImageObject',
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          ...(imageAlt && { caption: imageAlt })
        },
        url: canonicalUrl,
        ...(readingTime && { 
          timeRequired: `PT${readingTime}M`,
          wordCount: parseInt(readingTime) * 200 // Approximate words per minute
        }),
        ...(category && {
          articleSection: category,
          about: {
            '@type': 'Thing',
            name: category
          }
        }),
        ...(tags.length > 0 && {
          keywords: tags.join(', '),
          mentions: tags.map(tag => ({
            '@type': 'Thing',
            name: tag
          }))
        }),
        inLanguage: language
      };
      
      baseSchema['@graph'].push(blogPostSchema);
    }

    // FAQ Schema (if FAQ data exists)
    if (faqData.length > 0) {
      const faqSchema = {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqData.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };
      
      baseSchema['@graph'].push(faqSchema);
    }

    // Breadcrumb Schema (for non-homepage)
    if (pageType !== 'homepage' && slug) {
      const breadcrumbSchema = {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': baseUrl,
              name: 'Home'
            }
          },
          ...(category ? [{
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': `${baseUrl}/category/${category.toLowerCase().replace(/\s+/g, '-')}/`,
              name: category
            }
          }] : []),
          {
            '@type': 'ListItem',
            position: category ? 3 : 2,
            item: {
              '@id': canonicalUrl,
              name: title
            }
          }
        ]
      };
      
      baseSchema['@graph'].push(breadcrumbSchema);
    }

    // Add all schemas to graph
    baseSchema['@graph'].push(websiteSchema, authorSchema, webPageSchema);

    return baseSchema;
  };

  const metadata = {
    title: metaTitle || title,
    description: metaDescription,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle || title,
      description: metaDescription,
      url: canonicalUrl,
      siteName: siteName,
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
      locale: language === 'en' ? 'en_US' : language,
      type: pageType === 'blog' ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle || title,
      description: metaDescription,
      images: [imageUrl],
      creator: twitterHandle,
    },
    robots: {
      index: indexStatus === 'index',
      follow: followStatus === 'follow',
    },
    authors: [{ name: authorName, url: authorUrl }],
    other: {
      'article:published_time': datePublished,
      'article:modified_time': dateModified,
      ...(category && { 'article:section': category }),
      ...(tags.length > 0 && { 'article:tag': tags.join(', ') }),
      ...(readingTime && { 'reading-time': `${readingTime} min read` }),
    },
    verification: {
      google: 'your-google-site-verification',
    },
  };

  // Add structured data
  metadata.other = {
    ...metadata.other,
    'application/ld+json': JSON.stringify(generateSchemaData()),
  };

  return metadata;
}

export default function BlogHeadComponent(props) {
  // This component is now just a wrapper that generates metadata
  // The actual metadata is handled by Next.js through the generateMetadata function
  return null;
}