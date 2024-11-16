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
      </Head>    
    <div className="flex h-screen">
      {/* Sidebar with collapsible functionality */}
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isMobile && isSidebarCollapsed ? "ml-16" : isMobile ? "ml-64" : ""
        }`}
      >
        <div className="p-8">
          <PageTitle title="Home" className="lg hidden" />

          {/* Full Card Section */}
          <div className="bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            {/* Title Section */}
            <h1 className="text-3xl font-extrabold mb-6">
              Merhaba, Olá, Hello, Salut, Ciao, Hallo!
            </h1>
            <p className="text-lg font-semibold mb-4">
              Merhaba, ben Gökberk{"  "}-{" "}Hi, I am Gökberk (Goki) - Oi, Aqui é Goki 🤙🏽
            </p>
            <p className="text-lg font-semibold mb-4">
              I enjoy travelling and taking pictures 🏕️ 🛤️ 📸 
            </p>

              {/* Experience Section */}
              <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-2 text-xl">👨🏻‍💻</span>Experience
              </h2>
              <ul className="space-y-6">
              <BioDetail
                  content="Full Stack Software Engineer at"
                  institute="Tor.app"
                  link="https://tor.app"
                  details={[
                    "I develop things and take care of the landing pages...",
                  ]}
                />
                <BioDetail
                  content="Data Science Intern at"
                  institute="STM"
                  link="https://www.stm.com.tr/tr"
                  details={[
                    "Acronym-Definition pair matching in PDFs and measuring relevancy of texts with the given topic.",
                  ]}
                />
                <BioDetail
                  content="Software Test Engineering Intern at"
                  institute="Aselsan"
                  link="https://www.aselsan.com/tr"
                  details={[
                    "Implemented an SNMP TRAP listener for military radios in a test suite written in C#.",
                  ]}
                />
                <BioDetail
                  content="Technical Product Intern at"
                  institute="Peaka"
                  link="https://www.peaka.com"
                  details={[
                    "Created templates for customers using the no-code platform Peaka.",
                  ]}
                />
              </ul>
            </section>

            {/* Bio Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">
                <span className="mr-2 text-xl">🎓</span>Education
              </h2>
              <ul className="space-y-6">
                <BioDetail
                  content="Graduate of B.Sc. in Computer Engineering from"
                  institute="Bilkent University"
                  link="https://w3.bilkent.edu.tr/www/"
                  details={[
                    "Board Member of Erasmus Student Network Bilkent as the Local Representative.",
                    "Lifelong member of Paragliding(Bilhavk), Photography(BFK) and Nature Sports(DOST) Societies.",
                  ]}
                />
              </ul>
            </section>

            {/* Projects Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-2 text-xl">📝</span>Projects
              </h2>
              <ul className="space-y-6">
                <BioDetail
                  content="SoCoolBus - Senior Project User Experience Award Winner"
                  institute="CS Fair 2023"
                  link="https://w3.cs.bilkent.edu.tr/uncategorized/cs-fair-2023/"
                  details={[
                    "Developed a cross-platform mobile application with Flutter for school bus drivers, parents, bus companies, and school administration.",
                    "Implemented the front-end of the application for many core functionalities.",
                  ]}
                />
              </ul>
            </section>


          </div>
        </div>
      </main>
    </div>
    </>
  );
}
