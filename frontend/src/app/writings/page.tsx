import WritingCard from "@/components/WritingCard";
import { getWritings } from "@/lib/api";

export const revalidate = 60;

export default async function WritingsPage() {
  const writings = await getWritings().catch(() => []);

  return (
    <div>
      <header className="mb-10">
        <p className="font-mono text-xs text-google-red tracking-widest uppercase mb-2">Archive</p>
        <h1 className="font-pixel text-xl text-gray-900 dark:text-gray-100">Writings</h1>
        <div className="w-12 h-1 bg-google-red rounded mt-3" />
      </header>

      {writings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-pixel text-[10px] text-gray-300 dark:text-gray-600 mb-3">...</p>
          <p className="text-sm text-gray-400">No writings yet — coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {writings.map((writing) => (
            <WritingCard key={writing.id} writing={writing} />
          ))}
        </div>
      )}
    </div>
  );
}
