'use client';

import { SideMenu } from "@/components/SideMenu";
import Image from 'next/image';
import { useState, useEffect } from 'react';

const photos = [
  {
    src: "/gallery/engagement.jpg",
    alt: "Engagement portrait",
    caption: "Engagement.",
  },
  {
    src: "/gallery/erdemesiee.jpg",
    alt: "Portrait photography — Erdem",
    caption: "Erdem.",
  },
  {
    src: "/gallery/balat.jpg",
    alt: "Balat neighbourhood, Istanbul",
    caption: "Balat, Istanbul.",
  },
];

export default function GalleryClient() {
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 transition-all duration-300 md:ml-64">
        <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Gallery
            </h1>
            <p className="text-gray-600">
              Waiting for my lab to develop some photos…
            </p>
          </header>

          <div className="space-y-10">
            {photos.map((photo) => (
              <figure key={photo.src} className="flex flex-col items-center">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1200}
                  height={1600}
                  className="rounded-lg shadow-md w-full h-auto max-w-3xl object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <figcaption className="text-sm text-gray-500 mt-2 text-center">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
