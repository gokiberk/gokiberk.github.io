'use client';

import { SideMenu } from "@/components/SideMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

// Slugify that handles Turkish characters sanely.
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function computeReadingTime(blocks) {
  const words = blocks.reduce((sum, b) => {
    if (typeof b.text === 'string') {
      return sum + b.text.trim().split(/\s+/).filter(Boolean).length;
    }
    return sum;
  }, 0);
  return Math.max(1, Math.round(words / 220));
}

function initials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();
}

export default function WritingEntryClient({
  entry,
  allEntriesMetadata,
  lang,
  contentId,
  allUrls,
  relatedBlogEntries = [],
}) {
  const pathname = usePathname();
  const isTurkish = lang === 'tr';
  const currentSlug = pathname.split('/').pop();

  const sortedLanguageEntries = allEntriesMetadata
    .filter((item) => item.language === lang)
    .sort((a, b) => {
      if (!a.dateISO || !b.dateISO) return 0;
      return b.dateISO.localeCompare(a.dateISO);
    });

  const currentEntryIndex = sortedLanguageEntries.findIndex(
    (item) => item.slug === currentSlug,
  );
  const previousEntry =
    currentEntryIndex > 0 ? sortedLanguageEntries[currentEntryIndex - 1] : null;
  const nextEntry =
    currentEntryIndex >= 0 && currentEntryIndex < sortedLanguageEntries.length - 1
      ? sortedLanguageEntries[currentEntryIndex + 1]
      : null;

  const mainH1Block = entry.content.find((block) => block.type === 'h1');
  const displayTitle = (mainH1Block && mainH1Block.text) || entry.title;

  // Build TOC and augment blocks with stable IDs for headings.
  const { blocks, tocItems } = useMemo(() => {
    const items = [];
    const seen = new Map();
    const out = entry.content.map((block) => {
      if (block.type === 'h2' || block.type === 'h3') {
        let base = slugify(block.text);
        if (!base) base = block.type;
        const n = (seen.get(base) || 0) + 1;
        seen.set(base, n);
        const id = n === 1 ? base : `${base}-${n}`;
        items.push({ id, text: block.text, level: block.type === 'h2' ? 2 : 3 });
        return { ...block, id };
      }
      return block;
    });
    return { blocks: out, tocItems: items };
  }, [entry.content]);

  const readingTime = useMemo(() => computeReadingTime(entry.content), [entry.content]);

  // Track which section is active in the TOC.
  const [activeId, setActiveId] = useState(tocItems[0]?.id || null);
  useEffect(() => {
    if (!tocItems.length || typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: [0, 1] },
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  function getBlogLink(blogEntry) {
    if (lang === 'tr') return `/writing/tr/${blogEntry.slug}`;
    if (blogEntry.language === 'en') return `/writing/${blogEntry.slug}`;
    if (blogEntry.language === 'tr') return `/writing/tr/${blogEntry.slug}`;
    return `/writing/${blogEntry.language}/${blogEntry.slug}`;
  }

  const breadcrumbLabels = isTurkish
    ? { home: 'Ana sayfa', writing: 'Yazılar' }
    : { home: 'Home', writing: 'Writing' };

  const labels = isTurkish
    ? {
        toc: 'İçindekiler',
        minRead: 'dk okuma',
        further: 'Daha Fazla Okuma',
        noImage: 'Görsel yok',
        previous: 'Önceki',
        next: 'Sonraki',
      }
    : {
        toc: 'Table of Contents',
        minRead: 'min read',
        further: 'Further Reading',
        noImage: 'No image',
        previous: 'Previous',
        next: 'Next',
      };

  const writingListHref = isTurkish ? '/writing/tr' : '/writing';

  return (
    <div className="flex flex-col md:flex-row min-h-screen" lang={isTurkish ? 'tr' : 'en'}>
      <SideMenu />

      <div className="flex flex-1 flex-col md:flex-row md:ml-64">
        {/* Writing Entries sidebar (kept as-is) */}
        <aside
          className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-8 hidden xl:block sticky top-0 h-screen"
          aria-label={isTurkish ? 'Yazı listesi' : 'Writing entries'}
        >
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              {isTurkish ? 'Yazılar' : 'Writing entries'}
            </p>
            <ul>
              {sortedLanguageEntries.map((item) => {
                const href =
                  item.language === 'en'
                    ? `/writing/${item.slug}`
                    : `/writing/${item.language}/${item.slug}`;
                const isCurrent = item.slug === currentSlug;
                return (
                  <li key={item.slug} className="mb-3 last:mb-0">
                    <Link
                      href={href}
                      className={`block group rounded-md px-2 py-1 -mx-2 transition-colors ${
                        isCurrent ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      <p
                        className={`font-medium leading-snug ${
                          isCurrent
                            ? 'text-gray-900'
                            : 'text-gray-800 group-hover:text-blue-700 transition-colors'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.date}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:pt-0 transition-all duration-300">
          <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10 max-w-[1120px] mx-auto">
            {/* Top bar: breadcrumbs + language switcher */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <nav aria-label="Breadcrumb" className="min-w-0">
                <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
                  <li>
                    <Link href="/" className="hover:text-gray-900 transition-colors">
                      {breadcrumbLabels.home}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-gray-300">
                    <ChevronRight size={14} />
                  </li>
                  <li>
                    <Link href={writingListHref} className="hover:text-gray-900 transition-colors">
                      {breadcrumbLabels.writing}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-gray-300">
                    <ChevronRight size={14} />
                  </li>
                  <li className="text-gray-900 font-medium truncate max-w-[240px] md:max-w-[360px]">
                    {entry.title}
                  </li>
                </ol>
              </nav>
              <LanguageSwitcher contentId={contentId} allUrls={allUrls} />
            </div>

            {/* Hero */}
            <header className="mb-8">
              {entry.category && (
                <span className="inline-block uppercase text-[11px] font-bold tracking-wider bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full mb-5">
                  {entry.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15] mb-4">
                {displayTitle}
              </h1>
              {(entry.excerpt || entry.metaDescription) && (
                <p className="text-lg text-gray-600 max-w-prose leading-relaxed">
                  {entry.excerpt || entry.metaDescription}
                </p>
              )}

              {/* Author row */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                {entry.author && (
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold shadow-sm"
                    >
                      {initials(entry.author)}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-gray-900">{entry.author}</span>
                      {entry.authorRole && (
                        <span className="text-xs text-gray-500">{entry.authorRole}</span>
                      )}
                    </div>
                  </div>
                )}
                {entry.date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} aria-hidden="true" className="text-gray-400" />
                    <time dateTime={entry.dateISO || undefined}>{entry.date}</time>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock size={15} aria-hidden="true" className="text-gray-400" />
                  <span>
                    {readingTime} {labels.minRead}
                  </span>
                </div>
              </div>
            </header>

            {/* Featured image */}
            {entry.featuredImage && (
              <figure className="mb-10">
                <img
                  src={entry.featuredImage}
                  alt={entry.title}
                  className="w-full max-h-[420px] object-cover rounded-xl shadow-sm"
                  loading="eager"
                />
              </figure>
            )}

            {/* TOC + Body */}
            <div
              className={`grid gap-10 ${
                tocItems.length > 0 ? 'lg:grid-cols-[240px_minmax(0,1fr)]' : ''
              }`}
            >
              {tocItems.length > 0 && (
                <aside aria-label={labels.toc} className="order-first lg:order-none">
                  <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto bg-blue-50/60 border border-blue-100 rounded-xl p-5">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-3">
                      <span
                        aria-hidden="true"
                        className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600"
                      />
                      {labels.toc}
                    </p>
                    <ul className="space-y-2 text-sm">
                      {tocItems.map((item) => (
                        <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                          <a
                            href={`#${item.id}`}
                            aria-current={activeId === item.id ? 'true' : undefined}
                            className={`block leading-snug transition-colors ${
                              activeId === item.id
                                ? 'text-blue-700 font-semibold'
                                : 'text-gray-700 hover:text-blue-700'
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              )}

              <article className="min-w-0 prose prose-lg prose-gray max-w-none prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-a:text-blue-600 hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-sm">
                {blocks.map((block, index) => {
                  if (block.type === 'h1') return null;
                  if (block.type === 'h2') {
                    return (
                      <h2
                        key={index}
                        id={block.id}
                        className="text-2xl font-bold mb-4 mt-10 scroll-mt-24"
                      >
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === 'h3') {
                    return (
                      <h3
                        key={index}
                        id={block.id}
                        className="text-xl font-semibold mb-3 mt-6 scroll-mt-24"
                      >
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === 'p') {
                    return (
                      <p key={index} className="text-gray-700 leading-relaxed mb-6">
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === 'inlineImage') {
                    return (
                      <figure key={index} className="my-8">
                        <img
                          src={block.filename}
                          alt={block.altText || ''}
                          className="w-full rounded-lg shadow-sm"
                          loading="lazy"
                        />
                        {block.figCaption && (
                          <figcaption className="text-sm text-gray-500 text-center mt-2">
                            {block.figCaption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  return null;
                })}
              </article>
            </div>

            {/* Previous / Next */}
            {(previousEntry || nextEntry) && (
              <nav
                aria-label={isTurkish ? 'Makale gezintisi' : 'Article navigation'}
                className="mt-16 pt-8 border-t border-gray-200 grid gap-4 md:grid-cols-2"
              >
                {previousEntry ? (
                  <Link
                    href={
                      previousEntry.language === 'en'
                        ? `/writing/${previousEntry.slug}`
                        : `/writing/${previousEntry.language}/${previousEntry.slug}`
                    }
                    className="group block rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all p-4"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      ← {labels.previous}
                    </span>
                    <span className="block mt-1 text-gray-900 font-semibold group-hover:text-blue-700 transition-colors">
                      {previousEntry.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
                {nextEntry ? (
                  <Link
                    href={
                      nextEntry.language === 'en'
                        ? `/writing/${nextEntry.slug}`
                        : `/writing/${nextEntry.language}/${nextEntry.slug}`
                    }
                    className="group block rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all p-4 md:text-right"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {labels.next} →
                    </span>
                    <span className="block mt-1 text-gray-900 font-semibold group-hover:text-blue-700 transition-colors">
                      {nextEntry.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
              </nav>
            )}

            {/* Further Reading */}
            {relatedBlogEntries.length > 0 && (
              <section className="mt-16 pt-10 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-6">{labels.further}</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {relatedBlogEntries.map((related) => (
                    <Link
                      key={related.slug}
                      href={getBlogLink(related)}
                      className="group block border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-sm transition-all"
                    >
                      {related.featuredImage ? (
                        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                          <img
                            src={related.featuredImage}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                          {labels.noImage}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {related.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
