'use client';

import { SideMenu } from "@/components/SideMenu";
import { PageTitle } from "@/components/PageTitle";
import { useState, useEffect } from 'react';
import projects from '@/data/projects/index.json';
import Link from 'next/link';

export default function Projects() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1300);
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Group projects by id to show both languages together
  const grouped = projects.reduce((acc, project) => {
    if (!acc[project.id]) acc[project.id] = [];
    acc[project.id].push(project);
    return acc;
  }, {});

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleMenu}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300 md:ml-64">
        <div className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto w-full"> {/* Added w-full to ensure proper width */}
          <PageTitle title="Projects" className="lg hidden" /> {/* Corrected title */}
          <div className="grid gap-8 mt-8">
            {Object.values(grouped).map((projectGroup) => (
              <Link 
                key={projectGroup[0].id} 
                href={projectGroup[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="border border-gray-200 rounded-lg hover:border-gray-400 transition-colors duration-200 p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-[248px] h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src={projectGroup[0].image} 
                        alt={projectGroup[0].title} 
                        className="w-[248px] h-32 object-cover rounded-lg" 
                      />
                    </div>
                    <div className="flex-1 text-left">
                      {projectGroup.map((proj) => (
                        <div key={`${proj.id}-${proj.language}`} className="mb-2">
                          <h2 className="text-xl font-semibold mb-2 text-gray-800">{proj.title}</h2>
                          <p className="text-gray-700 text-sm mb-1">{proj.description}</p>
                          <span className="text-gray-600 hover:text-gray-800">Visit</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}