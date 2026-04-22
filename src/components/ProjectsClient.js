'use client';

import { SideMenu } from "@/components/SideMenu";
import { useState, useEffect } from 'react';
import projects from '@/data/projects/index.json';
import Link from 'next/link';

export default function ProjectsClient() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1300);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const grouped = projects.reduce((acc, project) => {
    if (!acc[project.id]) acc[project.id] = [];
    acc[project.id].push(project);
    return acc;
  }, {});

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300 md:ml-64">
        <div className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto w-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Projects
            </h1>
            <p className="text-gray-600">
              A small collection of things I&apos;ve built and worked on.
            </p>
          </header>

          <div className="grid gap-6">
            {Object.values(grouped).map((projectGroup) => {
              const primary = projectGroup[0];
              const rel = [
                "noopener",
                "noreferrer",
                primary.nofollow && "nofollow",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <Link
                  key={primary.id}
                  href={primary.url}
                  target="_blank"
                  rel={rel}
                  className="group block rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all duration-200 p-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-full md:w-[248px] h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      <img
                        src={primary.image}
                        alt={`${primary.title} preview`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      {projectGroup.map((proj) => (
                        <div key={`${proj.id}-${proj.language || 'en'}`} className="mb-2 last:mb-0">
                          <h2 className="text-xl font-semibold mb-1 text-gray-900 group-hover:text-blue-700 transition-colors">
                            {proj.title}
                          </h2>
                          <p className="text-gray-700 text-sm mb-2">{proj.description}</p>
                          <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                            Visit <span aria-hidden="true" className="ml-1">→</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
