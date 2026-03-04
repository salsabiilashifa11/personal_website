import { Experience } from "@/lib/api";
import Image from "next/image";

const accentStyles = {
  blue: "border-l-google-blue",
  red: "border-l-google-red",
  yellow: "border-l-google-yellow",
  green: "border-l-google-green",
} as const;

interface Props {
  experience: Experience;
  accentColor?: keyof typeof accentStyles;
}

function OrgLogo({ logoUrl, name }: { logoUrl: string; name: string }) {
  if (logoUrl) {
    return (
      <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Image src={logoUrl} alt={name} fill className="object-contain p-1" unoptimized />
      </div>
    );
  }
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="w-10 h-10 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
      <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 leading-none">{initials}</span>
    </div>
  );
}

export default function ExperienceCard({ experience, accentColor = "blue" }: Props) {
  return (
    <div className={`bg-white dark:bg-[#1C1C1E] rounded-lg p-4 border border-gray-100 dark:border-gray-800 border-l-4 ${accentStyles[accentColor]} card-lift shadow-card`}>
      <div className="flex items-start gap-3">
        <OrgLogo logoUrl={experience.logo_url} name={experience.organization} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">{experience.title}</h3>
            <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0 mt-0.5">
              {experience.start_date} – {experience.end_date}
            </span>
          </div>
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-2">{experience.organization}</p>
          {experience.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{experience.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
