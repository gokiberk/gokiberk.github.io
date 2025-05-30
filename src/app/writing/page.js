import { getAllWritingEntriesMetadata } from '@/lib/writing';
import { SideMenu } from "@/components/SideMenu";
import Link from 'next/link';

export default async function WritingPage() {
  // Fetch all entries metadata on the server
  const allEntriesMetadata = getAllWritingEntriesMetadata();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Wrapper for Article Navigation and Main Content */}
      <div className="flex flex-1 flex-col md:flex-row ml-64">
        {/* Article Navigation (Desktop Only) */}
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto pt-16 hidden md:block">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Writing Entries</h3>
            <ul>
              {allEntriesMetadata.map((entry) => (
                <li key={entry.slug} className="mb-3 last:mb-0">
                  <Link href={`/writing/${entry.slug}`} className="block group">
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
            <h1 className="text-4xl font-extrabold mb-8">Writing</h1>
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to my writing section. Here you'll find articles about technology, personal experiences, and various projects I've worked on.
              Feel free to explore the entries listed in the sidebar.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {allEntriesMetadata.map((entry) => (
                <Link 
                  key={entry.slug} 
                  href={`/writing/${entry.slug}`}
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