import { getAllWritingEntriesMetadata } from '@/lib/writing';
import { SideMenu } from "@/components/SideMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from 'next/link';
import allUrls from '@/data/allUrls.json';

export const metadata = {
  title: "Writing",
  description:
    "Essays and travel notes by Gökberk Keskinkılıç — from a first week in Brazil and Erasmus in Paris to a Finike diary.",
  alternates: {
    canonical: "/writing",
    languages: {
      en: "/writing",
      tr: "/writing/tr",
    },
  },
  openGraph: {
    title: "Writing | Gökberk Keskinkılıç",
    description:
      "Essays and travel notes by Gökberk Keskinkılıç — personal experiences and projects.",
    url: "https://gokiberk.com/writing",
    images: ["/img/og-gokiberk.webp"],
  },
};

export default async function WritingPage() {
  const allEntriesMetadata = getAllWritingEntriesMetadata();

  const englishEntries = allEntriesMetadata
    .filter(entry => entry.language === 'en')
    .sort((a, b) => {
      if (!a.dateISO || !b.dateISO) return 0;
      return b.dateISO.localeCompare(a.dateISO);
    });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideMenu />

      <div className="flex flex-1 flex-col md:flex-row md:ml-64">
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-16 hidden lg:block">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Writing entries</h2>
            <ul>
              {englishEntries.map((entry) => (
                <li key={entry.slug} className="mb-3 last:mb-0">
                  <Link href={`/writing/${entry.slug}`} className="block group">
                    <p className="text-gray-800 group-hover:text-blue-600 transition-colors duration-200 font-medium">
                      {entry.title}
                    </p>
                    <p className="text-gray-500 text-sm">{entry.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300">
          <div className="p-4 md:p-8 lg:p-12 max-w-[800px] mx-auto">
            <div className="flex justify-end mb-4">
              <LanguageSwitcher contentId="writing" allUrls={allUrls} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Writing</h1>
            <p className="text-gray-700 leading-relaxed mb-8 max-w-prose">
              Welcome to my writing. Here you&apos;ll find essays about travel, personal
              experiences and the occasional project. Feel free to explore the entries below.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {englishEntries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/writing/${entry.slug}`}
                  className="group block border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-sm transition-all duration-200"
                >
                  {entry.featuredImage ? (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      <img
                        src={entry.featuredImage}
                        alt={entry.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gray-100" aria-hidden="true" />
                  )}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-1 text-gray-900 group-hover:text-blue-700 transition-colors">
                      {entry.title}
                    </h2>
                    <p className="text-gray-500 text-sm">{entry.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
