import BookCard from "@/components/BookCard";
import RecommendationDrawer from "@/components/RecommendationDrawer";
import { getBooks, BooksGrouped } from "@/lib/api";

export const revalidate = 60;

const sections: { key: keyof BooksGrouped; label: string; sublabel: string; color: string; dot: string }[] = [
  { key: "reading",   label: "Reading Now", sublabel: "Currently in progress", color: "text-google-blue",   dot: "bg-google-blue" },
  { key: "read",      label: "Have Read",   sublabel: "Finished",               color: "text-google-green",  dot: "bg-google-green" },
  { key: "will_read", label: "Will Read",   sublabel: "On the list",            color: "text-google-yellow", dot: "bg-google-yellow" },
];

export default async function ReadingPage() {
  const raw = await getBooks().catch((): BooksGrouped => ({ reading: [], read: [], will_read: [] }));

  return (
    <div className="space-y-12">
      <header className="mb-10">
        <p className="font-mono text-xs text-google-yellow tracking-widest uppercase mb-2">Books</p>
        <h1 className="font-pixel text-xl text-gray-900 dark:text-gray-100">Reading List</h1>
        <div className="w-12 h-1 bg-google-yellow rounded mt-3 mb-6" />
        <RecommendationDrawer />
      </header>

      {sections.map(({ key, label, sublabel, color, dot }) => {
        const books = raw[key];
        return (
          <section key={key}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
              <h2 className={`font-pixel text-[10px] ${color}`}>{label}</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{sublabel}</span>
              {books.length > 0 && (
                <span className="ml-auto font-mono text-xs text-gray-400 dark:text-gray-500">{books.length}</span>
              )}
            </div>
            {books.length === 0 ? (
              <p className="text-sm text-gray-400 italic pl-4">Nothing here yet.</p>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                {books.map((book) => <BookCard key={book.id} book={book} />)}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
