"use client";

import { useState } from "react";
import { createRecommendation } from "@/lib/api";

const inputCls = "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 focus:border-google-yellow transition";

export default function RecommendationDrawer() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", note: "", from: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async () => {
    if (!form.title.trim()) return;
    setStatus("sending");
    try {
      await createRecommendation(form);
      setStatus("done");
      setForm({ title: "", author: "", note: "", from: "" });
    } catch {
      setStatus("error");
    }
  };

  const reset = () => { setStatus("idle"); setOpen(false); };

  return (
    <div className="w-full">
      {/* Trigger button */}
      <button
        onClick={() => { setOpen((v) => !v); if (status === "done") setStatus("idle"); }}
        className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-full font-mono text-sm font-medium transition-all duration-200 ${
          open
            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
            : "bg-google-yellow text-gray-900 hover:brightness-95 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        }`}
      >
        <span className="text-base leading-none">📚</span>
        <span>{open ? "Never mind ↑" : "Got a book rec for me?"}</span>
        <span className={`ml-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>↓</span>
      </button>

      {/* Collapsible form */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="bg-white dark:bg-[#1C1C1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 max-w-lg shadow-card">
          {status === "done" ? (
            <div className="text-center py-4 space-y-2">
              <p className="text-2xl">🎉</p>
              <p className="font-pixel text-[10px] text-google-green">Thanks for the rec!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">I&apos;ll add it to the list.</p>
              <button
                onClick={reset}
                className="mt-3 text-xs font-mono text-gray-400 hover:text-google-yellow transition-colors underline underline-offset-2"
              >
                Close ↑
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className={inputCls}
                  placeholder="Book title *"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Author (optional)"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <textarea
                className={`${inputCls} resize-none h-20`}
                placeholder="Why do you love it? (optional)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <div className="flex gap-3 items-center">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Your name (optional)"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                />
                <button
                  onClick={submit}
                  disabled={!form.title.trim() || status === "sending"}
                  className="shrink-0 rounded-lg px-5 py-2 text-sm font-medium bg-google-yellow text-gray-900 hover:brightness-95 transition disabled:opacity-40"
                >
                  {status === "sending" ? "Sending…" : "Send →"}
                </button>
              </div>
              {status === "error" && (
                <p className="text-xs font-mono text-google-red">Something went wrong — try again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
