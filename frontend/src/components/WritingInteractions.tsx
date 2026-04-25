"use client";

import { useEffect, useState } from "react";
import { likeWriting, unlikeWriting, getWriting, getComments, createComment, WritingComment } from "@/lib/api";

interface Props {
  writingId: number;
  initialLikes: number;
}

export default function WritingInteractions({ writingId, initialLikes }: Props) {
  const likedKey = `liked_writing_${writingId}`;

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<WritingComment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(likedKey) === "1");
    getWriting(writingId).then((w) => setLikes(w.likes)).catch(() => {});
    getComments(writingId).then(setComments).catch(() => {});
  }, [writingId, likedKey]);

  async function handleLike() {
    try {
      if (liked) {
        const res = await unlikeWriting(writingId);
        setLikes(res.likes);
        setLiked(false);
        localStorage.removeItem(likedKey);
      } else {
        const res = await likeWriting(writingId);
        setLikes(res.likes);
        setLiked(true);
        localStorage.setItem(likedKey, "1");
      }
    } catch {
      // silent
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const comment = await createComment(writingId, { name: name.trim(), content: content.trim() });
      setComments((prev) => [...prev, comment]);
      setName("");
      setContent("");
      setSubmitted(true);
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-16 space-y-12">
      {/* Divider */}
      <div className="h-px bg-black dark:bg-white opacity-10" />

      {/* Like */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleLike}
          className={`group flex items-center gap-2 border-2 px-5 py-2.5 font-mono text-xs
            transition-all duration-150 active:translate-y-[2px] active:shadow-none
            ${liked
              ? "bg-google-red text-white border-google-red shadow-pixel hover:bg-transparent hover:text-google-red"
              : "bg-white dark:bg-[#1C1C1E] text-gray-700 dark:text-gray-300 border-black dark:border-gray-600 shadow-pixel hover:bg-google-red hover:text-white hover:border-google-red"
            }`}
        >
          <span className={`text-base transition-transform duration-150
            ${liked ? "scale-125" : "group-hover:scale-125 group-active:scale-110"}`}>
            {liked ? "♥" : "♡"}
          </span>
          <span>{liked ? "liked!" : "like this"}</span>
        </button>
        <span key={likes} className="font-pixel text-[9px] text-gray-400 dark:text-gray-500 animate-pop">
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
      </div>

      {/* Comments */}
      <div>
        <h2 className="font-pixel text-[11px] text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span className="text-google-yellow">▸</span>
          comments{comments.length > 0 && ` (${comments.length})`}
        </h2>

        {/* Comment list */}
        {comments.length > 0 && (
          <div className="space-y-4 mb-8">
            {comments.map((c, index) => (
              <div
                key={c.id}
                className="border-2 border-black dark:border-gray-700 p-4 shadow-pixel bg-white dark:bg-[#1C1C1E] animate-fadeSlideIn"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-[9px] text-google-blue">{c.name}</span>
                  <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="font-mono text-[12px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {comments.length === 0 && (
          <p className="font-mono text-[11px] text-gray-400 dark:text-gray-500 mb-8 pt-2">
            no comments yet — be the first!
          </p>
        )}

        {/* Comment form */}
        {submitted ? (
          <p className="font-mono text-[11px] text-google-green border-2 border-google-green px-4 py-3 shadow-pixel animate-fadeSlideIn">
            ▸ thanks for your comment!
          </p>
        ) : (
          <form onSubmit={handleComment} className="space-y-3">
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              className="w-full border-2 border-black dark:border-gray-600 bg-white dark:bg-[#1C1C1E] px-3 py-2 font-mono text-[12px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-google-blue shadow-pixel focus:shadow-pixel-blue transition-shadow duration-150"
            />
            <textarea
              placeholder="leave a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              required
              className="w-full border-2 border-black dark:border-gray-600 bg-white dark:bg-[#1C1C1E] px-3 py-2 font-mono text-[12px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-google-blue shadow-pixel focus:shadow-pixel-blue transition-shadow duration-150 resize-none"
            />
            {error && (
              <p className="font-mono text-[11px] text-google-red">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="border-2 border-black dark:border-gray-600 bg-white dark:bg-[#1C1C1E] px-5 py-2 font-mono text-[11px] text-gray-900 dark:text-gray-100 shadow-pixel hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-150 active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0"
            >
              {submitting ? "posting..." : "post comment ▸"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
