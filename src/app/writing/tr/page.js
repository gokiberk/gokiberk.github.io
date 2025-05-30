import { SideMenu } from "@/components/SideMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import allUrls from '@/data/allUrls.json';

// Helper function to read and parse JSON file
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
  // Read Turkish content directly
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
      };
    })
  );

  const validEntries = turkishEntries.filter(Boolean);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Wrapper for Article Navigation and Main Content */}
      <div className="flex flex-1 flex-col md:flex-row ml-64">
        {/* Article Navigation (Desktop Only) */}
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-16 hidden md:block">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Yazılar</h3>
            <ul>
              {validEntries.map((entry) => (
                <li key={entry.slug} className="mb-3 last:mb-0">
                  <Link href={`/writing/tr/${entry.slug}`} className="block group">
                    <p className="text-gray-800 group-hover:text-blue-600 transition-colors duration-200 font-medium">{entry.title}</p>
                    <p className="text-gray-500 text-sm">{entry.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300">
          <div className="p-4 md:p-8 lg:p-12 max-w-[800px] mx-auto">
            <div className="flex justify-end mb-4">
              <LanguageSwitcher contentId="writing" allUrls={allUrls} />
            </div>
            <h1 className="text-4xl font-extrabold mb-8">Yazılar</h1>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yazı bölümüme hoş geldiniz. Burada teknoloji, kişisel deneyimler ve üzerinde çalıştığım çeşitli projeler hakkında makaleler bulabilirsiniz.
              Kenar çubuğunda listelenen yazıları keşfetmekten çekinmeyin.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {validEntries.map((entry) => (
                <Link 
                  key={entry.slug} 
                  href={`/writing/tr/${entry.slug}`}
                  className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors duration-200"
                >
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{entry.title}</h2>
                  <p className="text-gray-500 text-sm">{entry.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 