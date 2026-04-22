import Link from 'next/link';
import { cn } from '@/lib/utils';

export const NavigationLink = ({ href, label, icon, shortcutNumber, className }) => {
  const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
  const mergedClassName = cn(
    "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
    className,
  );

  const content = (
    <>
      {icon && (
        <span aria-hidden="true" className="text-gray-500 flex-shrink-0">
          {icon}
        </span>
      )}
      <span>{label}</span>
      {shortcutNumber && (
        <span className="ml-auto text-xs text-gray-400">[{shortcutNumber}]</span>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
        className={mergedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={mergedClassName}>
      {content}
    </Link>
  );
};
