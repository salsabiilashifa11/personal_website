"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getDrummingMedia, DrummingMedia } from "@/lib/api";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/);
  return m ? m[1] : null;
}

function MediaTile({ item }: { item: DrummingMedia }) {
  const ytId = item.media_type === "video" ? getYouTubeId(item.url) : null;

  return (
    <div className="break-inside-avoid mb-3 group relative rounded-xl overflow-hidden border border-purple-900/30 bg-[#111]">
      {ytId ? (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : item.media_type === "video" ? (
        <video src={item.url} controls className="w-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.url} alt={item.caption || "drumming"} className="w-full object-cover" />
      )}
      {item.caption && (
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 pointer-events-none">
          <p className="text-white text-xs font-mono leading-snug">{item.caption}</p>
        </div>
      )}
    </div>
  );
}

export default function DrummingPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [media, setMedia] = useState<DrummingMedia[]>([]);

  useEffect(() => {
    setMounted(true);
    document.title = "// drumming — shifa";
    getDrummingMedia().then(setMedia).catch(() => {});
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

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="pt-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs text-purple-400/70 tracking-widest uppercase">secret page</span>
          <span className="px-2 py-0.5 rounded-full border border-purple-800 text-purple-400 font-mono text-[10px]">dark only</span>
        </div>
        <h1 className="font-pixel text-xl sm:text-2xl text-purple-300 leading-snug mb-4">Drumming</h1>
        <div className="flex gap-1.5 mb-4">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-700" />
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
        </div>
        <p className="font-mono text-sm text-gray-400 max-w-xl leading-relaxed">
          photos &amp; videos from sessions, gigs, and random drumming moments.
        </p>
      </section>

      {/* Masonry grid */}
      {media.length === 0 ? (
        <p className="font-mono text-sm text-gray-600 italic">nothing uploaded yet — check back soon.</p>
      ) : (
        <div className="columns-2 sm:columns-3 gap-3">
          {media.map((item) => (
            <MediaTile key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
