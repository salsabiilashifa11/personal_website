"use client";

import { useState } from "react";
import BookCard from "@/components/BookCard";
import PaperCard from "@/components/PaperCard";
import { BooksGrouped, PapersGrouped } from "@/lib/api";

const sections = [
  { key: "reading"  as const, label: "Reading Now", sublabel: "Currently in progress", color: "text-google-blue",   dot: "bg-google-blue" },
  { key: "read"     as const, label: "Have Read",   sublabel: "Finished",               color: "text-google-green",  dot: "bg-google-green" },
  { key: "will_read"as const, label: "Will Read",   sublabel: "On the list",            color: "text-google-yellow", dot: "bg-google-yellow" },
];

interface Props {
  books: BooksGrouped;
  papers: PapersGrouped;
}

export default function ReadingContent({ books, papers }: Props) {
  const [view, setView] = useState<"books" | "papers">("books");

  return (
    <div className="space-y-10">
      {/* Toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {(["books", "papers"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              view === v
                ? "bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Sections */}
      {sections.map(({ key, label, sublabel, color, dot }) => {
        const items = view === "books" ? books[key] : papers[key];
        return (
          <section key={key}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
              <h2 className={`font-pixel text-[10px] ${color}`}>{label}</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{sublabel}</span>
              {items.length > 0 && (
                <span className="ml-auto font-mono text-xs text-gray-400 dark:text-gray-500">{items.length}</span>
              )}
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-gray-400 italic pl-4">Nothing here yet.</p>
            ) : view === "books" ? (
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                {books[key].map((book) => <BookCard key={book.id} book={book} />)}
              </div>
            ) : (
              <div className="space-y-2">
                {papers[key].map((paper) => <PaperCard key={paper.id} paper={paper} />)}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
