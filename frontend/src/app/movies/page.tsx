"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getMovies, Movie } from "@/lib/api";

function parseGenres(genre: string): string[] {
  return genre.split(",").map((g) => g.trim()).filter(Boolean);
}

function MovieCard({ movie }: { movie: Movie }) {
  const genres = movie.genre ? parseGenres(movie.genre) : [];
  return (
    <div className="flex gap-4 bg-[#111] border border-purple-900/30 rounded-xl p-4 hover:border-purple-700/50 transition-colors">
      {movie.poster_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-16 h-24 object-cover rounded-lg border border-purple-900/40 shrink-0"
        />
      ) : (
        <div className="w-16 h-24 rounded-lg border border-purple-900/40 bg-purple-950/30 flex items-center justify-center shrink-0">
          <span className="text-purple-700 text-xl">▶</span>
        </div>
      )}
      <div className="flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <h3 className="font-pixel text-[10px] text-purple-200 leading-snug">{movie.title}</h3>
            {movie.year && <span className="font-mono text-xs text-purple-500">{movie.year}</span>}
          </div>
          {movie.director && (
            <p className="font-mono text-xs text-gray-500 mb-1">dir. {movie.director}</p>
          )}
          {movie.description && (
            <p className="font-mono text-xs text-gray-400 leading-relaxed line-clamp-3">{movie.description}</p>
          )}
        </div>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded-full border border-purple-800/60 text-purple-500 font-mono text-[10px]"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MoviesPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    document.title = "// watchlist — shifa";
    getMovies().then(setMovies).catch(() => {});
  }, []);

  if (!mounted) return null;

  if (resolvedTheme !== "dark") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="text-4xl select-none">🔒</div>
        <h1 className="font-pixel text-[11px] text-gray-400">access denied</h1>
        <p className="font-mono text-sm text-gray-500 max-w-xs">
          this page only exists in the dark. flip that toggle and come back.
        </p>
      </div>
    );
  }

  const allGenres = Array.from(
    new Set(movies.flatMap((m) => (m.genre ? parseGenres(m.genre) : [])))
  ).sort();

  const filtered = activeGenre
    ? movies.filter((m) => m.genre && parseGenres(m.genre).includes(activeGenre))
    : movies;

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="pt-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs text-purple-400/70 tracking-widest uppercase">secret page</span>
          <span className="px-2 py-0.5 rounded-full border border-purple-800 text-purple-400 font-mono text-[10px]">dark only</span>
        </div>
        <h1 className="font-pixel text-xl sm:text-2xl text-purple-300 leading-snug mb-4">Watchlist</h1>
        <div className="flex gap-1.5 mb-4">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-700" />
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
        </div>
        <p className="font-mono text-sm text-gray-400 max-w-xl leading-relaxed">
          films and shows i think are worth your time. heavily biased, obviously.
        </p>
      </section>

      {/* Genre filters */}
      {allGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveGenre(null)}
            className={`px-3 py-1 rounded-full font-mono text-[11px] border transition-colors ${
              activeGenre === null
                ? "bg-purple-700 border-purple-600 text-white"
                : "border-purple-800/60 text-purple-500 hover:border-purple-600"
            }`}
          >
            all
          </button>
          {allGenres.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(activeGenre === g ? null : g)}
              className={`px-3 py-1 rounded-full font-mono text-[11px] border transition-colors ${
                activeGenre === g
                  ? "bg-purple-700 border-purple-600 text-white"
                  : "border-purple-800/60 text-purple-500 hover:border-purple-600"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Movie list */}
      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 italic">no recommendations yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
