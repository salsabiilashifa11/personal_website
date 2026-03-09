import { Book } from "@/lib/api";
import Image from "next/image";

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-100 dark:border-gray-800 shadow-card card-lift flex flex-col w-36 shrink-0 overflow-hidden">
      {book.cover_url ? (
        <div className="relative w-full aspect-[2/3]">
          <Image src={book.cover_url} alt={book.title} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="font-pixel text-[6px] text-gray-400 dark:text-gray-500 text-center px-2 leading-relaxed">NO COVER</span>
        </div>
      )}
      <div className="p-3 space-y-0.5">
        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">{book.title}</p>
        <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500">{book.author}</p>
      </div>
    </div>
  );
}
