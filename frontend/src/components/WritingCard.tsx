import Link from "next/link";
import Image from "next/image";
import { Writing } from "@/lib/api";

interface Props {
  writing: Writing;
  featured?: boolean;
}

function readingTime(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

const GRADIENTS = [
  "from-google-red/20 via-google-yellow/10 to-white dark:to-[#1C1C1E]",
  "from-google-blue/20 via-google-blue/5 to-white dark:to-[#1C1C1E]",
  "from-google-green/20 via-google-yellow/10 to-white dark:to-[#1C1C1E]",
  "from-google-yellow/20 via-google-red/10 to-white dark:to-[#1C1C1E]",
];

export default function WritingCard({ writing, featured = false }: Props) {
  const date = new Date(writing.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const mins = writing.content ? readingTime(writing.content) : null;
  const hasInternalContent = Boolean(writing.content);
  const gradient = GRADIENTS[writing.id % GRADIENTS.length];

  const href = hasInternalContent ? `/writings/${writing.id}` : writing.medium_url;
  const linkProps = hasInternalContent
    ? {}
    : { target: "_blank", rel: "noopener noreferrer" };

  if (featured) {
    return (
      <Link href={href} {...linkProps} className="group block">
        <div className="relative overflow-hidden rounded-xl border-2 border-black dark:border-gray-700 shadow-pixel bg-white dark:bg-[#1C1C1E] flex flex-col sm:flex-row min-h-[260px]">
          {/* Text side */}
          <div className="flex flex-col justify-between p-7 sm:w-1/2 z-10">
            <div>
              <p className="font-mono text-[10px] text-google-red tracking-widest uppercase mb-4">
                Featured
              </p>
              <h2 className="font-pixel text-base leading-relaxed text-gray-900 dark:text-gray-100 group-hover:text-google-red transition-colors mb-4">
                {writing.title}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">{date}</span>
              {mins && <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">{mins} min read</span>}
              <span className="ml-auto font-mono text-[11px] text-google-red group-hover:translate-x-1 transition-transform inline-block">
                {hasInternalContent ? "Read →" : "Read on Medium →"}
              </span>
            </div>
          </div>

          {/* Image side */}
          <div className="relative sm:w-1/2 h-48 sm:h-auto">
            {writing.cover_image ? (
              <Image
                src={writing.cover_image}
                alt={writing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} {...linkProps} className="group block h-full">
      <div className="h-full bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-100 dark:border-gray-800 border-t-2 border-t-google-red overflow-hidden shadow-card flex flex-col">
        {/* Cover */}
        <div className="relative w-full h-36">
          {writing.cover_image ? (
            <Image
              src={writing.cover_image}
              alt={writing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center gap-3 mb-2">
            <p className="font-mono text-[10px] text-google-red tracking-wider uppercase">{date}</p>
            {mins && <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500">{mins} min</p>}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug group-hover:text-google-red transition-colors flex-1">
            {writing.title}
          </h3>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 font-mono group-hover:text-google-red transition-colors">
            {hasInternalContent ? "Read →" : "Read on Medium →"}
          </p>
        </div>
      </div>
    </Link>
  );
}
