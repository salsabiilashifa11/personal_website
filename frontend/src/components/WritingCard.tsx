import { Writing } from "@/lib/api";

interface Props {
  writing: Writing;
}

export default function WritingCard({ writing }: Props) {
  const date = new Date(writing.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <a
      href={writing.medium_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-[#1C1C1E] rounded-lg p-5 border border-gray-100 dark:border-gray-800 border-t-4 border-t-google-red card-lift shadow-card group"
    >
      <p className="font-mono text-[10px] text-google-red mb-2 tracking-wider uppercase">{date}</p>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug group-hover:text-google-red transition-colors">
        {writing.title}
      </h3>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 font-mono group-hover:text-google-red transition-colors">
        Read on Medium →
      </p>
    </a>
  );
}
