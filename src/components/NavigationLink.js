import Link from 'next/link';

export const NavigationLink = ({ href, label, icon, shortcutNumber }) => (
  <Link
    href={href}
    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
  >
    {icon && <span className="text-gray-500">{icon}</span>}
    <span>{label}</span>
    {shortcutNumber && (
      <span className="ml-auto text-xs text-gray-400">[{shortcutNumber}]</span>
    )}
  </Link>
);
