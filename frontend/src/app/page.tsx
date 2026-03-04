import ExperienceCard from "@/components/ExperienceCard";
import TypingText from "@/components/TypingText";
import { getAbout, getExperiences } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  const [about, experiences] = await Promise.all([
    getAbout().catch(() => ({ id: 1, content: "", tagline: "" })),
    getExperiences().catch(() => []),
  ]);

  const professional = experiences.filter((e) => e.type === "professional");
  const education = experiences.filter((e) => e.type === "education");

  const taglineItems = about.tagline
    ? about.tagline.split("\n").map((s) => s.trim()).filter(Boolean)
    : ["software engineer", "curious human"];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-4 pb-2">
        <p className="font-mono text-sm text-google-blue mb-3 tracking-widest uppercase">
          hey, I&apos;m
        </p>
        <h1 className="font-pixel text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 leading-snug mb-3">
          Shifa
        </h1>

        {/*
          Previous design: rainbow gradient underline
          <div className="gradient-underline w-24 mb-6" />

          Current design: four Google-color square dots
        */}
        <div className="flex gap-1.5 mb-6">
          <span className="w-2.5 h-2.5 rounded-sm bg-google-blue" />
          <span className="w-2.5 h-2.5 rounded-sm bg-google-red" />
          <span className="w-2.5 h-2.5 rounded-sm bg-google-yellow" />
          <span className="w-2.5 h-2.5 rounded-sm bg-google-green" />
        </div>

        <TypingText items={taglineItems} />
      </section>

      {/* About */}
      {about.content && (
        <section>
          <SectionLabel color="text-google-blue">About Me</SectionLabel>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base max-w-2xl whitespace-pre-wrap">
            {about.content}
          </p>
        </section>
      )}

      {/* Experiences */}
      <section>
        <SectionLabel color="text-gray-900 dark:text-gray-100">Experience</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <div className="space-y-4">
            <span className="inline-block font-mono text-xs text-google-blue bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded">
              Professional
            </span>
            {professional.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nothing here yet.</p>
            ) : (
              professional.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} accentColor="blue" />
              ))
            )}
          </div>
          <div className="space-y-4">
            <span className="inline-block font-mono text-xs text-google-red bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded">
              Education
            </span>
            {education.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nothing here yet.</p>
            ) : (
              education.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} accentColor="red" />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2 className={`font-pixel text-[11px] ${color} mb-5 tracking-wide`}>
      {children}
    </h2>
  );
}
