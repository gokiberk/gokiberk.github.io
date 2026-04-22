import { SideMenu } from "@/components/SideMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import allUrls from '@/data/allUrls.json';

export const metadata = {
  title: "Yazılar",
  description:
    "Gökberk Keskinkılıç'ın seyahat, kişisel deneyim ve projeler üzerine yazıları.",
  alternates: {
    canonical: "/writing/tr",
    languages: {
      en: "/writing",
      tr: "/writing/tr",
    },
  },
  openGraph: {
    title: "Yazılar | Gökberk Keskinkılıç",
    description: "Gökberk Keskinkılıç'ın seyahatleri ve deneyimleri üzerine yazıları.",
    url: "https://gokiberk.com/writing/tr",
    images: ["/img/og-gokiberk.webp"],
    locale: "tr_TR",
  },
};

async function readJsonFile(filePath) {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

export default async function WritingPageTR() {
  const trDataDirectory = path.join(process.cwd(), 'src', 'data', 'writing', 'tr');
  const fileNames = await fs.readdir(trDataDirectory);
  const jsonFiles = fileNames.filter(file => file.endsWith('.json'));

  const turkishEntries = await Promise.all(
    jsonFiles.map(async fileName => {
      const slug = fileName.replace(/\.json$/, '');
      const fullPath = path.join(trDataDirectory, fileName);
      const jsonData = await readJsonFile(fullPath);
      if (!jsonData) return null;

      return {
        slug,
        title: jsonData.title,
        date: jsonData.date,
        dateISO: jsonData.dateISO,
        featuredImage: jsonData.featuredImage || null,
      };
    })
  );

  const validEntries = turkishEntries
    .filter(Boolean)
    .sort((a, b) => {
      if (!a.dateISO || !b.dateISO) return 0;
      return b.dateISO.localeCompare(a.dateISO);
    });

  return (
    <div className="flex flex-col md:flex-row min-h-screen" lang="tr">
      <SideMenu />

      <div className="flex flex-1 flex-col md:flex-row md:ml-64">
        <aside
          className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-8 hidden xl:block sticky top-0 h-screen"
          aria-label="Yazı listesi"
        >
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Yazılar
            </p>
            <ul>
              {validEntries.map((entry) => (
                <li key={entry.slug} className="mb-3 last:mb-0">
                  <Link
                    href={`/writing/tr/${entry.slug}`}
                    className="block group rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-gray-50"
                  >
                    <p className="font-medium leading-snug text-gray-800 group-hover:text-blue-700 transition-colors">
                      {entry.title}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{entry.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300">
          <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10 max-w-[1600px] mx-auto">
            <div className="flex justify-end mb-4">
              <LanguageSwitcher contentId="writing" allUrls={allUrls} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Yazılar</h1>
            <p className="text-gray-700 leading-relaxed mb-8 max-w-prose">
              Yazı bölümüme hoş geldiniz. Burada seyahatler, kişisel deneyimler ve üzerinde
              çalıştığım çeşitli projeler hakkında yazılar bulabilirsiniz. Aşağıdaki yazıları
              keşfetmekten çekinmeyin.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {validEntries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/writing/tr/${entry.slug}`}
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
                    <h2 className="text-lg font-semibold mb-1 text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
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
