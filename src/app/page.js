'use client';

import { SideMenu } from "@/components/SideMenu";
import { PageTitle } from "@/components/PageTitle";
import { BioDetail } from "@/components/BioDetail";
import { useState, useEffect } from "react";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Head from 'next/head';

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleResize = () => {
    const mobile = window.innerWidth < 1300;
    setIsMobile(mobile);
    setIsSidebarCollapsed(mobile); // Automatically collapse sidebar on mobile
  };

  useEffect(() => {
    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize); // Listen for resize events
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  return (
    <>
      <Head>
        <title>Gökberk Keskinkılıç</title>
        <meta
          name="description"
          content="Gökberk Keskinkılıç's personal website."
        />
        <meta
          property="og:description"
          content="Gökberk Keskinkılıç's personal website."
        />
        <meta property="og:title" content="Gökberk Keskinkılıç" />
        <meta property="og:image" content="/img/og-gokiberk.webp" />
        <link rel="canonical" href="https://gokiberk.com/" />
      </Head>    
    <div className="flex flex-col min-h-screen">
      {/* Sidebar with collapsible functionality */}
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300 ${
        !isMobile ? (isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''
      }`}>
        <div className="p-4 md:p-8 lg:p-12 max-w-[1000px] mx-auto">
          {/* Introductory Bio Text */}
          <div className="mb-6">
            <p className="mb-8 text-gray-700">
              Merhaba, ben Gökberk{"  "}-{" "}Hi, I am Gökberk (Goki) - Oi, Aqui é Goki 🤙🏽
            </p>
          </div>

          {/* Work Experience Summary */}
          <div className="mb-8 text-gray-700">
            <p>
              Previously I have worked as a Full Stack Developer at Tor.app, interned at STM as Data Science Intern,
              Aselsan as Software Test Engineering Intern and at Peaka as Technical Product Intern.
            </p>
            <p className="mb-8 text-gray-700">
              I enjoy travelling and taking pictures 🏕️ 🛤️ 📸
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projects Card */}
            <a href="/projects" className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h2 className="text-xl font-bold mb-2">📝 Projects</h2>
              <p className="text-gray-200">Transkriptor.com landing page.</p>
            </a>

            {/* Writing Card */}
            <a href="/writing" className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h2 className="text-xl font-bold mb-2">✍️ Writing</h2>
              <p className="text-gray-200">First week in Brazil...</p>
            </a>

            {/* Gallery Card */}
            <a href="/gallery" className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col">
              <img src="/gallery/engagement.jpg" alt="Engagement" width={400} height={250} className="rounded-md mb-4 object-cover w-full" />
              <h2 className="text-xl font-bold mb-2">📸 Gallery</h2>
              <p className="text-gray-200">Latest addition: Engagement Photo.</p>
            </a>

            {/* Travel Card */}
            <a href="/travel" className="block bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col">
              <img src="/gallery/greekEaster.jpg" alt="Greek Easter" width={400} height={250} className="rounded-md mb-4 object-cover w-full" />
              <h2 className="text-xl font-bold mb-2">🏕️ Travel</h2>
              <p className="text-gray-200">Recently: Greek Easter.</p>
            </a>
          </div>

        </div>
      </main>
    </div>
    </>
  );
}
