"use client";

import {
  Search, Bot, Brain, MessageCircle, Terminal, Code2,
  Film, Gauge, Music, BookOpen, FlaskConical, Sparkles,
  Database, Clapperboard, Cpu, Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const COLOR_CLASSES = ["chip-blue", "chip-red", "chip-yellow", "chip-green"] as const;

const INTEREST_ICONS: Record<string, LucideIcon> = {
  "information retrieval": Search,
  "machine learning": Bot,
  "deep learning": Brain,
  "nlp": MessageCircle,
  "natural language processing": MessageCircle,
  "foss": Terminal,
  "open source": Code2,
  "movies": Clapperboard,
  "film": Film,
  "f1": Gauge,
  "formula 1": Gauge,
  "music": Music,
  "drumming": Music,
  "reading": BookOpen,
  "research": FlaskConical,
  "ai": Sparkles,
  "data": Database,
  "systems": Cpu,
  "web": Globe,
};

function getIcon(label: string): LucideIcon | null {
  return INTEREST_ICONS[label.toLowerCase()] ?? null;
}

export default function InterestChips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((label, i) => {
        const colorClass = COLOR_CLASSES[i % 4];
        const Icon = getIcon(label);
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
