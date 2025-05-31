import React from 'react';
import Head from 'next/head';

const BlogHeadComponent = ({
  title = 'My Personal Blog',
  metaDescription = 'Welcome to my personal blog where I share my thoughts, experiences, and adventures.',
  metaTitle,
  slug = '',
  language = 'en',
  pageType = "blog", // blog, homepage, page
  siteName = 'My Blog',
  contentId = '',
  dateModified,
  datePublished,
  indexStatus = 'index',
  followStatus = 'follow',
  
  // Blog specific
  authorName = 'Your Name',
  authorUrl = '',
  authorImage = '/img/author.jpg',
  
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
  baseUrl = 'https://yourblog.com',
  twitterHandle = '@yourblog',
  
  // Additional meta
  excerpt = ''
}) => {
  
  // Generate canonical URL
  const canonicalUrl = slug 
    ? `${baseUrl}/${slug}/`
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

  const schemaData = JSON.stringify(generateSchemaData(), null, 0);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="title" content={metaTitle} />
      <meta name="robots" content={`${indexStatus}, ${followStatus}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={pageType === 'blog' ? 'article' : 'website'} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={imageWidth.toString()} />
      <meta property="og:image:height" content={imageHeight.toString()} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : language} />
      
      {/* Article specific Open Graph tags */}
      {pageType === 'blog' && (
        <>
          <meta property="article:author" content={authorName} />
          {datePublished && <meta property="article:published_time" content={datePublished} />}
          {dateModified && <meta property="article:modified_time" content={dateModified} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {authorUrl && <meta name="twitter:creator" content={twitterHandle} />}
      
      {/* Additional Meta Tags */}
      {authorName && <meta name="author" content={authorName} />}
      {category && <meta name="article:section" content={category} />}
      {tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}
      {readingTime && <meta name="reading-time" content={`${readingTime} min read`} />}
      
      {/* Language */}
      <meta httpEquiv="content-language" content={language} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaData }}
      />
    </Head>
  );
};

export default BlogHeadComponent;