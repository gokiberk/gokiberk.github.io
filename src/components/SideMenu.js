'use client';

import Link from 'next/link';
import { NavigationLink } from '@/components/NavigationLink';
import { PROFILES, LINKS } from '@/lib/constants';

export const SideMenu = () => {
  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* User Profile */}
      <Link href="/" className="flex items-center gap-3 p-4">
        <img
          src="/img/headshot.png"
          alt="Gökberk Keskinkılıç"
          width={50}
          height={50}
          className="rounded-full border shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-semibold tracking-tight">Gökberk Keskinkılıç</span>
          <span className="text-sm text-gray-600">Software Engineer</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 mt-2 px-4">
        {LINKS.map((link) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
          />
        ))}
      </nav>

      {/* Divider */}
      <hr className="my-4" />

      {/* Online Profiles Section */}
      <div>
        <span className="text-xs font-medium text-gray-600 uppercase px-4">Social Accounts</span>
        <div className="flex flex-col gap-2 mt-2 px-4">
          {Object.values(PROFILES).map((profile) => (
            <NavigationLink
              key={profile.url}
              href={profile.url}
              label={profile.title}
              icon={profile.icon}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
