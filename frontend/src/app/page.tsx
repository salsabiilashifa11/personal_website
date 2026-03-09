import ExperienceCard from "@/components/ExperienceCard";
import InterestChips from "@/components/InterestChips";
import TypingText from "@/components/TypingText";
import PixelCharacter from "@/components/PixelCharacter";
import { getAbout, getExperiences } from "@/lib/api";

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
    <div className="space-y-10">
      {/* Hero */}
      <section className="pt-4">
        <p className="font-mono text-sm text-google-blue mb-3 tracking-widest uppercase">
          hey, I&apos;m
        </p>
        <h1 className="font-pixel text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 leading-snug mb-3 flex items-center">
          Shifa
          <PixelCharacter />
        </h1>

        <div className="flex gap-1.5 mb-5">
          <span className="w-2.5 h-2.5 rounded-sm bg-google-blue" />
          <span className="w-2.5 h-2.5 rounded-sm bg-google-red" />
          <span className="w-2.5 h-2.5 rounded-sm bg-google-yellow" />
          <span className="w-2.5 h-2.5 rounded-sm bg-google-green" />
        </div>

        <TypingText items={taglineItems} />

        {/* Social links */}
        <div className="flex gap-4 mt-5">
          <a
            href="https://github.com/salsabiilashifa11"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-400 hover:text-google-blue transition-colors duration-150"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/shifa-salsabiila/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-google-blue transition-colors duration-150"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://leetcode.com/u/salsabiilashifa11"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LeetCode"
            className="text-gray-400 hover:text-google-yellow transition-colors duration-150"
          >
            <LeetCodeIcon />
          </a>
          <a
            href="mailto:salsabiilashifa11@gmail.com"
            aria-label="Email"
            className="text-gray-400 hover:text-google-red transition-colors duration-150"
          >
            <GmailIcon />
          </a>
        </div>
      </section>

      {/* About */}
      {about.content && (
        <section>
          <SectionLabel color="text-google-blue">About Me</SectionLabel>
          <ContentBlock content={about.content} />
        </section>
      )}

      {/* Interests */}
      {interestItems.length > 0 && (
        <section>
          <SectionLabel color="text-google-yellow">Interests</SectionLabel>
          <InterestChips items={interestItems} />
        </section>
      )}

      {/* Experiences */}
      <section>
        <SectionLabel color="text-google-green">Experience</SectionLabel>
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
    <div className="space-y-4">
      {paragraphs.map((para, i) => {
        const darkOnly = /^<for dark mode only>\s*/i.test(para);
        const text = darkOnly ? para.replace(/^<for dark mode only>\s*/i, "") : para;
        const rendered = text.split("\n").map((line, j, arr) => (
          <span key={j}>{parseInline(line)}{j < arr.length - 1 && <br />}</span>
        ));
        if (darkOnly) {
          return (
            <p key={i} className="hidden dark:block dark:text-purple-300 leading-relaxed text-base">
              {rendered}
            </p>
          );
        }
        return (
          <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {rendered}
          </p>
        );
      })}
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2 className={`font-pixel text-sm ${color} mb-5 tracking-wide`}>
      {children}
    </h2>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
