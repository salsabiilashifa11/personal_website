"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const links = [
  { label: "Home",     href: "/",        color: "text-google-blue",   activeBar: "bg-google-blue" },
  { label: "Writings", href: "/writings", color: "text-google-red",    activeBar: "bg-google-red" },
  { label: "Bookshelf",  href: "/reading",  color: "text-google-yellow", activeBar: "bg-google-yellow" },
  { label: "Admin",    href: "/admin",    color: "text-google-green",  activeBar: "bg-google-green" },
];

const secretLinks = [
  { label: "Drumming", href: "/drumming", icon: "drum" },
  { label: "Watchlist", href: "/movies",   icon: "film" },
];


function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {isDark ? (
        // Sun icon
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4"/>
          <path strokeLinecap="round" strokeWidth={2} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        // Moon icon
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-pixel text-[11px] text-gray-900 dark:text-gray-100 hover:text-google-blue transition-colors">
            shifa.
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            <nav className="flex items-center gap-1">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-5 text-sm font-medium transition-colors ${
                      active ? link.color : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    {link.label}
                    {active && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${link.activeBar}`} />}
                  </Link>
                );
              })}

              {isDark && (
                <>
                  <span className="mx-1 text-gray-700 select-none text-xs">|</span>
                  {secretLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        title="secret page"
                        className={`relative px-3 py-5 text-sm font-medium italic transition-colors ${
                          active
                            ? "text-purple-300"
                            : "text-purple-400 hover:text-purple-300"
                        }`}
                      >
                        {link.label}
                        {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>
            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="sm:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-l-4 transition-colors ${
                  active
                    ? `${link.color} border-current bg-gray-50 dark:bg-gray-900`
                    : "text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isDark && (
            <>
              <div className="mx-6 my-1 border-t border-dashed border-purple-900/50" />
              {secretLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium italic border-l-4 transition-colors ${
                      active
                        ? "text-purple-300 border-purple-400 bg-gray-900"
                        : "text-purple-400 border-transparent hover:bg-gray-900 hover:text-purple-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      )}
    </header>
  );
}
