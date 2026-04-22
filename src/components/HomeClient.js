'use client';

import { SideMenu } from "@/components/SideMenu";
import { useState, useEffect } from "react";
import Image from 'next/image';

export default function HomeClient() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1300;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main
        className={`flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300 ${
          !isMobile ? (isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''
        }`}
      >
        <div className="p-4 md:p-8 lg:p-12 max-w-[1000px] mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
              Merhaba, ben Gökberk
            </h1>
            <p className="text-lg text-gray-600">
              Hi, I am Gökberk (Goki). Oi, aqui é Goki. <span aria-hidden="true">🤙🏽</span>
            </p>
          </section>

          <section className="mb-10 text-gray-700 leading-relaxed space-y-4 max-w-prose">
            <p>
              Previously I worked as a Full Stack Developer at Tor.app, and interned as a
              Data Science Intern at STM, a Software Test Engineering Intern at Aselsan,
              and a Technical Product Intern at Peaka.
            </p>
            <p>
              I enjoy travelling and taking pictures{" "}
              <span aria-hidden="true">🏕️ 🛤️ 📸</span>
            </p>
          </section>

          <section aria-label="Site sections" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/projects"
              className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <h2 className="text-xl font-bold mb-2">
                <span aria-hidden="true">📝</span> Projects
              </h2>
              <p className="text-gray-200">Transkriptor.com landing page and more.</p>
            </a>

            <a
              href="/writing"
              className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <h2 className="text-xl font-bold mb-2">
                <span aria-hidden="true">✍️</span> Writing
              </h2>
              <p className="text-gray-200">Latest: Finike Diary.</p>
            </a>

            <a
              href="/gallery"
              className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <Image
                src="/gallery/engagement.jpg"
                alt="Engagement portrait"
                width={332}
                height={221}
                className="rounded-md mb-4 object-cover w-full"
                sizes="(max-width: 400px) 100vw, 332px"
                priority
              />
              <h2 className="text-xl font-bold mb-2">
                <span aria-hidden="true">📸</span> Gallery
              </h2>
              <p className="text-gray-200">Latest addition: Engagement photo.</p>
            </a>

            <a
              href="/travel"
              className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <Image
                src="/gallery/greekEaster.jpg"
                alt="Greek Easter celebration"
                width={332}
                height={221}
                className="rounded-md mb-4 object-cover w-full"
                sizes="(max-width: 400px) 100vw, 332px"
                priority
              />
              <h2 className="text-xl font-bold mb-2">
                <span aria-hidden="true">🏕️</span> Travel
              </h2>
              <p className="text-gray-200">Recently: Greek Easter.</p>
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
