"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import React, { useState, useEffect, useCallback } from "react";

interface LiComponentProps {
  children?: React.ReactNode;
  index?: number;
}

function OlComponent({ children }: { children?: React.ReactNode }) {
  let i = 0;
  const numbered = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    i++;
    return React.cloneElement(child as React.ReactElement<LiComponentProps>, { index: i });
  });
  return (
    <ol className="font-sans text-[15px] leading-[1.75] text-gray-700 dark:text-gray-300 mb-6 space-y-2 list-none pl-4">
      {numbered}
    </ol>
  );
}

function UlComponent({ children }: { children?: React.ReactNode }) {
  return (
    <ul className="font-sans text-[15px] leading-[1.75] text-gray-700 dark:text-gray-300 mb-6 space-y-2 list-none pl-4">
      {children}
    </ul>
  );
}

function LiComponent({ children, index }: LiComponentProps) {
  return (
    <li className="flex gap-3 items-start">
      {index !== undefined ? (
        <span className="font-mono text-[13px] text-google-blue shrink-0 mt-0.5 min-w-[1.2rem]">{index}.</span>
      ) : (
        <span className="text-google-red font-pixel text-[8px] mt-[7px] shrink-0">▸</span>
      )}
      <span>{children}</span>
    </li>
  );
}

interface Props {
  content: string;
}

interface LightboxState {
  src: string;
  alt: string;
}

export default function WritingRenderer({ content }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox]);

  const components: Components = {
    h1: ({ children }) => (
      <h1 className="font-mono font-bold text-lg leading-snug tracking-tight text-gray-900 dark:text-gray-100 mt-12 mb-5">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-mono font-bold text-sm leading-snug tracking-tight text-gray-900 dark:text-gray-100 mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-mono font-bold text-xs tracking-widest text-gray-500 dark:text-gray-400 uppercase mt-8 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="font-sans text-[15px] leading-[1.75] text-gray-700 dark:text-gray-300 mb-6">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-google-blue underline underline-offset-2 decoration-google-blue/40 hover:decoration-google-blue transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
    ),
    blockquote: ({ children }) => (
      <blockquote className="flex gap-3 items-start bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 rounded-lg px-4 py-3 my-6">
        <span className="text-google-blue text-base shrink-0 mt-0.5">ℹ️</span>
        <div className="font-sans text-[15px] leading-[1.75] text-gray-600 dark:text-gray-400">
          {children}
        </div>
      </blockquote>
    ),
    ul: UlComponent,
    ol: OlComponent,
    li: LiComponent,
    hr: () => (
      <hr className="my-10 border-none h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
    ),
    img: ({ src, alt, title }) => (
      <figure className="my-6">
        <button
          type="button"
          onClick={() => setLightbox({ src: src ?? "", alt: alt ?? "" })}
          className="block w-full cursor-zoom-in focus:outline-none group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt ?? ""}
            className="rounded-lg border border-gray-100 dark:border-gray-800 shadow-card w-full transition-opacity group-hover:opacity-90"
          />
        </button>
        {title && (
          <figcaption className="mt-2 text-center font-mono text-[11px] text-gray-400 dark:text-gray-500 italic">
            {title}
          </figcaption>
        )}
      </figure>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full font-mono text-[12px] border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b-2 border-gray-900 dark:border-gray-100">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 text-left font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-[10px]">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
        {children}
      </td>
    ),
    code: ({ className, children }) => {
      const isBlock = className?.startsWith("language-");
      const lang = className?.replace("language-", "") ?? "";

      if (isBlock) {
        return (
          <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {lang && (
              <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
                <span className="font-mono text-[10px] text-google-red tracking-widest uppercase">{lang}</span>
                <span className="font-pixel text-[8px] text-gray-300 dark:text-gray-600">code</span>
              </div>
            )}
            <pre className="bg-[#0d1117] dark:bg-[#0d1117] p-5 overflow-x-auto">
              <code className="font-mono text-[12px] leading-relaxed text-gray-300 whitespace-pre">
                {children}
              </code>
            </pre>
          </div>
        );
      }

      return (
        <code className="font-mono text-[12px] bg-gray-100 dark:bg-gray-800 text-google-red px-1.5 py-0.5 rounded">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <>{children}</>,
  };

  return (
    <>
      <article>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </article>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={closeLightbox}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
