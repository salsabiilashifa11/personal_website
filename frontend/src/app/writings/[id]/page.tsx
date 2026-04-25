import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getWriting } from "@/lib/api";
import WritingRenderer from "@/components/WritingRenderer";
import WritingInteractions from "@/components/WritingInteractions";

export const revalidate = 0;

interface Props {
  params: { id: string };
}

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function WritingPage({ params }: Props) {
  const writing = await getWriting(params.id).catch(() => null);

  if (!writing || !writing.content) notFound();

  const date = new Date(writing.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mins = readingTime(writing.content);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/writings"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-gray-400 dark:text-gray-500 hover:text-google-red transition-colors mb-10 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        <span>All writings</span>
      </Link>

      {/* Cover image */}
      <div className="relative w-[calc(100%+2rem)] sm:w-full h-56 sm:h-72 mb-10 -mx-4 sm:mx-0 overflow-hidden sm:rounded-xl sm:border-2 sm:border-black dark:border-gray-700 sm:shadow-pixel">
        {writing.cover_image ? (
          <Image
            src={writing.cover_image}
            alt={`Cover for ${writing.title}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-google-red/20 via-google-yellow/20 to-google-blue/20 dark:from-google-red/10 dark:via-google-yellow/10 dark:to-google-blue/10 flex items-center justify-center">
            <span className="font-pixel text-[10px] text-gray-400 dark:text-gray-600 select-none">cover image</span>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="mb-12">
        <p className="font-mono text-[10px] text-google-red tracking-widest uppercase mb-4">Essay</p>
        <h1 className="font-pixel text-lg leading-relaxed text-gray-900 dark:text-gray-100 mb-6">
          {writing.title}
        </h1>
        <div className="flex items-center gap-3 font-mono text-xs text-gray-400 dark:text-gray-500">
          <span>{date}</span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span>{mins} min read</span>
        </div>
        <div className="mt-6 h-px bg-gradient-to-r from-google-red via-google-yellow to-transparent" />
      </header>

      {/* Body */}
      <div className="mt-2">
        <WritingRenderer content={writing.content} />
      </div>

      {/* Likes & Comments */}
      <WritingInteractions writingId={writing.id} initialLikes={writing.likes ?? 0} />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/writings"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-gray-400 dark:text-gray-500 hover:text-google-red transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Back to writings</span>
        </Link>
      </footer>
    </div>
  );
}
