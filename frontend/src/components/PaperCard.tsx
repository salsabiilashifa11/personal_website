import { Paper } from "@/lib/api";

interface Props {
  paper: Paper;
}

export default function PaperCard({ paper }: Props) {
  const inner = (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-100 dark:border-gray-800 shadow-card px-4 py-3 space-y-1 hover:border-google-blue dark:hover:border-google-blue transition-colors">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
        {paper.title}
      </p>
      {paper.authors && (
        <p className="font-mono text-[11px] text-gray-500 dark:text-gray-400 truncate">
          {paper.authors}
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {paper.venue && (
          <span className="font-mono text-[10px] text-google-blue bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
            {paper.venue}
          </span>
        )}
        {paper.year && (
          <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
            {paper.year}
          </span>
        )}
      </div>
    </div>
  );

  if (paper.url) {
    return (
      <a href={paper.url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return inner;
}
