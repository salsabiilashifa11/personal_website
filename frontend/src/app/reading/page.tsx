import RecommendationDrawer from "@/components/RecommendationDrawer";
import ReadingContent from "@/components/ReadingContent";
import { getBooks, getPapers, BooksGrouped, PapersGrouped } from "@/lib/api";

export const revalidate = 60;

export default async function ReadingPage() {
  const [books, papers] = await Promise.all([
    getBooks().catch((): BooksGrouped => ({ reading: [], read: [], will_read: [] })),
    getPapers().catch((): PapersGrouped => ({ reading: [], read: [], will_read: [] })),
  ]);

  return (
    <div className="space-y-12">
      <header className="mb-10">
        <p className="font-mono text-xs text-google-yellow tracking-widest uppercase mb-2">Reading</p>
        <h1 className="font-pixel text-xl text-gray-900 dark:text-gray-100">Reading List</h1>
        <div className="w-12 h-1 bg-google-yellow rounded mt-3 mb-6" />
        <RecommendationDrawer />
      </header>

      <ReadingContent books={books} papers={papers} />
    </div>
  );
}
