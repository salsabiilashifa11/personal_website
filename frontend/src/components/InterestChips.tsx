"use client";

import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const COLOR_CLASSES = ["chip-blue", "chip-red", "chip-yellow", "chip-green"] as const;

const FALLBACK_ICONS: Record<string, string> = {
  "information retrieval": "Search",
  "machine learning": "Bot",
  "deep learning": "Brain",
  "nlp": "MessageCircle",
  "natural language processing": "MessageCircle",
  "foss": "Terminal",
  "open source": "Code2",
  "movies": "Clapperboard",
  "film": "Film",
  "f1": "Gauge",
  "formula 1": "Gauge",
  "music": "Music",
  "drumming": "Music",
  "reading": "BookOpen",
  "research": "FlaskConical",
  "ai": "Sparkles",
  "data": "Database",
  "systems": "Cpu",
  "web": "Globe",
};

interface InterestItem {
  label: string;
  icon?: string;
}

function getIcon(label: string, name?: string): LucideIcon | null {
  const iconName = name || FALLBACK_ICONS[label.toLowerCase()];
  if (!iconName) return null;
  const icon = (LucideIcons as Record<string, unknown>)[iconName];
  return icon ? (icon as LucideIcon) : null;
}

export default function InterestChips({ items }: { items: InterestItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ label, icon }, i) => {
        const colorClass = COLOR_CLASSES[i % 4];
        const Icon = getIcon(label, icon);
        const enterDelay = i * 70;
        const floatDelay = 500 + i * 180;
        return (
          <span
            key={i}
            className={`font-mono text-xs px-4 py-2 rounded-full border flex items-center gap-1.5 ${colorClass}`}
            style={{
              opacity: 0,
              animation: `chip-enter 0.4s ease ${enterDelay}ms forwards, chip-float 2.8s ease-in-out ${floatDelay}ms infinite`,
            }}
          >
            {Icon && <Icon size={12} strokeWidth={2} className="shrink-0" />}
            {label}
          </span>
        );
      })}
    </div>
  );
}
