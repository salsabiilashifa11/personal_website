"use client";

import { Experience } from "@/lib/api";
import Image from "next/image";
import { useState } from "react";

const accentStyles = {
  blue: "border-l-google-blue",
  red: "border-l-google-red",
  yellow: "border-l-google-yellow",
  green: "border-l-google-green",
} as const;

interface Props {
  experience: Experience;
  accentColor?: keyof typeof accentStyles;
  timeline?: boolean;
}

function OrgLogo({ logoUrl, name, large }: { logoUrl: string; name: string; large?: boolean }) {
  const size = large ? "w-10 h-10 sm:w-14 sm:h-14" : "w-10 h-10";
  const radius = large ? "rounded-lg sm:rounded-xl" : "rounded-lg";
  const textSize = large ? "text-sm" : "text-[10px]";

  if (logoUrl) {
    return (
      <div className={`relative ${size} shrink-0 ${radius} overflow-hidden border border-gray-100 dark:border-gray-700 bg-white`}>
        <Image src={logoUrl} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className={`${size} shrink-0 ${radius} bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center`}>
      <span className={`${textSize} font-semibold text-gray-500 dark:text-gray-400 leading-none`}>{initials}</span>
    </div>
  );
}

const PREVIEW_COUNT = 2;

function Description({ text, accentColor }: { text: string; accentColor: keyof typeof accentStyles }) {
  const [expanded, setExpanded] = useState(false);
  const bullets = text.split("\n").map(l => l.trim()).filter(Boolean);

  const moreColor = {
    yellow: "text-google-yellow",
    blue: "text-google-blue",
    red: "text-google-red",
    green: "text-google-green",
  }[accentColor];

  if (bullets.length <= 1) {
    return <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>;
  }

  const visible = expanded ? bullets : bullets.slice(0, PREVIEW_COUNT);

  return (
    <div>
      <ul className="space-y-1">
        {visible.map((b, i) => (
          <li key={i} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {bullets.length > PREVIEW_COUNT && (
        <button
          onClick={() => setExpanded(v => !v)}
          className={`mt-2 font-mono text-[11px] ${moreColor} hover:underline`}
        >
          {expanded ? "show less" : `+${bullets.length - PREVIEW_COUNT} more`}
        </button>
      )}
    </div>
  );
}

export default function ExperienceCard({ experience, accentColor = "blue", timeline = false }: Props) {
  const cardClass = timeline
    ? "bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
    : `bg-white dark:bg-[#1C1C1E] rounded-lg p-6 border border-gray-100 dark:border-gray-800 border-l-4 ${accentStyles[accentColor]} card-lift shadow-card`;

  return (
    <div className={cardClass}>
      <div className="flex items-start gap-4">
        <OrgLogo logoUrl={experience.logo_url} name={experience.organization} large={timeline} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">{experience.title}</h3>
            <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0 mt-0.5">
              {experience.start_date} · {experience.end_date}
            </span>
          </div>
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-3">{experience.organization}</p>
          {experience.description && <Description text={experience.description} accentColor={accentColor} />}
        </div>
      </div>
    </div>
  );
}
