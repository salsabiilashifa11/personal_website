import ExperienceCard from "@/components/ExperienceCard";
import InterestChips from "@/components/InterestChips";
import TypingText from "@/components/TypingText";
import PixelCharacter from "@/components/PixelCharacter";
import Image from "next/image";
import { getAbout, getExperiences, Experience } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  const [about, experiences] = await Promise.all([
    getAbout().catch(() => ({ id: 1, content: "", tagline: "", interests: "" })),
    getExperiences().catch(() => []),
  ]);

  const professional = experiences.filter((e) => e.type === "professional");
  const education = experiences.filter((e) => e.type === "education");

  const taglineItems = about.tagline
    ? about.tagline.split("\n").map((s) => s.trim()).filter(Boolean)
    : ["software engineer", "curious human"];

  const interestItems = about.interests
    ? about.interests.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-16">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="-mx-2 pt-10 pb-12 px-8 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-2xl bg-[#F0F2F5] dark:bg-[#111116]">
        {/* Left: text */}
        <div>
          <p className="font-mono text-sm text-google-blue mb-3 tracking-widest uppercase">
            hey, I&apos;m
          </p>
          <h1 className="font-pixel text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 leading-snug mb-6 flex items-center">
            Shifa
            <PixelCharacter />
          </h1>

          <div className="flex gap-1.5 mb-8">
            <a href="#about" title="About Me" className="w-2.5 h-2.5 rounded-sm bg-google-blue hover:scale-125 transition-transform duration-150" />
            <a href="/writings" title="Writings" className="w-2.5 h-2.5 rounded-sm bg-google-red hover:scale-125 transition-transform duration-150" />
            <a href="#interests" title="Interests" className="w-2.5 h-2.5 rounded-sm bg-google-yellow hover:scale-125 transition-transform duration-150" />
            <a href="#experience" title="Experience" className="w-2.5 h-2.5 rounded-sm bg-google-green hover:scale-125 transition-transform duration-150" />
          </div>

          <TypingText items={taglineItems} />

          {/* Social links — boxed icons */}
          <div className="flex gap-3 mt-8">
            <SocialBox href="https://github.com/salsabiilashifa11" label="GitHub" hoverColor="hover:border-google-blue hover:text-google-blue">
              <GitHubIcon />
            </SocialBox>
            <SocialBox href="https://www.linkedin.com/in/shifa-salsabiila/" label="LinkedIn" hoverColor="hover:border-google-blue hover:text-google-blue">
              <LinkedInIcon />
            </SocialBox>
            <SocialBox href="https://leetcode.com/u/salsabiilashifa11" label="LeetCode" hoverColor="hover:border-google-yellow hover:text-google-yellow">
              <LeetCodeIcon />
            </SocialBox>
            <SocialBox href="mailto:salsabiilashifa11@gmail.com" label="Email" hoverColor="hover:border-google-red hover:text-google-red">
              <GmailIcon />
            </SocialBox>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/hero_illustration.svg"
            alt="Hero illustration"
            className="w-full max-w-sm aspect-square object-contain opacity-90 dark:[filter:invert(1)_hue-rotate(180deg)]"
          />
        </div>
      </section>

      {/* ── About ────────────────────────────────────────── */}
      {about.content && (
        <section id="about">
          <SectionLabel color="text-google-blue">About Me</SectionLabel>
          <ContentBlock content={about.content} />
        </section>
      )}

      {/* ── Interests ────────────────────────────────────── */}
      {interestItems.length > 0 && (
        <section id="interests">
          <SectionLabel color="text-google-green">Interests</SectionLabel>
          <InterestChips items={interestItems} />
        </section>
      )}

      {/* ── Experience ───────────────────────────────────── */}
      <section id="experience">
        <SectionLabel color="text-google-yellow">Experience</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Professional */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <BriefcaseIcon className="w-4 h-4 text-google-yellow" />
              <span className="font-mono text-xs text-google-yellow">Professional</span>
            </div>
            <Timeline items={professional} accentColor="yellow" />
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <GraduationCapIcon className="w-4 h-4 text-google-blue" />
              <span className="font-mono text-xs text-google-blue">Education</span>
            </div>
            <Timeline items={education} accentColor="blue" />
          </div>
        </div>
      </section>

    </div>
  );
}

function Timeline({ items, accentColor }: { items: Experience[]; accentColor: "yellow" | "blue" | "red" | "green" }) {
  if (items.length === 0) return <p className="text-sm text-gray-400 italic">Nothing here yet.</p>;

  const ringColor = {
    yellow: "border-google-yellow",
    blue: "border-google-blue",
    red: "border-google-red",
    green: "border-google-green",
  }[accentColor];

  const lineColor = {
    yellow: "bg-google-yellow/30",
    blue: "bg-google-blue/30",
    red: "bg-google-red/30",
    green: "bg-google-green/30",
  }[accentColor];

  return (
    <div className="relative">
      {/* Continuous vertical line behind dots */}
      <div className={`absolute left-[7px] top-5 bottom-5 w-px ${lineColor}`} />

      <div className="space-y-4">
        {items.map((exp) => (
          <div key={exp.id} className="flex gap-5 items-start">
            {/* Hollow ring dot, outside the card */}
            <div className={`relative z-10 mt-5 shrink-0 w-3.5 h-3.5 rounded-full border-2 ${ringColor} bg-white dark:bg-[#0D0D0D]`} />
            {/* Card — no left border, bigger logo */}
            <div className="flex-1 min-w-0">
              <ExperienceCard experience={exp} accentColor={accentColor} timeline />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialBox({
  href, label, hoverColor, children,
}: {
  href: string; label: string; hoverColor: string; children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`flex items-center justify-center w-9 h-9 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 transition-all duration-150 ${hoverColor}`}
    >
      {children}
    </a>
  );
}

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold bg-blue-200 dark:bg-blue-500/40 px-0.5 rounded-sm">{part.slice(2, -2)}</strong>
      : part
  );
}

function ContentBlock({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => {
        const darkOnly = /^<for dark mode only>\s*/i.test(para);
        const text = darkOnly ? para.replace(/^<for dark mode only>\s*/i, "") : para;
        const rendered = text.split("\n").map((line, j, arr) => (
          <span key={j}>{parseInline(line)}{j < arr.length - 1 && <br />}</span>
        ));
        if (darkOnly) {
          return (
            <div key={i} className="hidden dark:block space-y-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-pixel text-[9px] text-google-blue border border-google-blue px-1.5 py-0.5 overflow-hidden whitespace-nowrap inline-block"
                  style={{ width: 0, animation: 'secret-typing-14 1.2s steps(14, end) forwards' }}
                >
                  [ BONUS LORE ]
                </span>
                <span
                  className="font-pixel text-[9px] text-google-blue"
                  style={{ opacity: 0, animation: 'secret-blink 0.8s step-end 1.2s infinite' }}
                >
                  █
                </span>
              </div>
              <p
                className="text-gray-200 leading-relaxed text-base bg-blue-500/5 border border-blue-500/10 rounded px-3 py-2"
                style={{ opacity: 0, animation: 'secret-reveal 0.6s ease 1.6s forwards' }}
              >
                {rendered}
              </p>
            </div>
          );
        }
        if (i === 0) {
          return (
            <p key={i} className="font-mono text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              {rendered}
            </p>
          );
        }
        return (
          <div key={i} className="relative pl-5">
            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-google-blue rounded-full" />
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
              {rendered}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2 className={`font-pixel text-base ${color} mb-5 tracking-wide`}>
      {children}
    </h2>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
