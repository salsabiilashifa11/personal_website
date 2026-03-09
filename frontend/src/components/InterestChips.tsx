"use client";

const COLOR_CLASSES = ["chip-blue", "chip-red", "chip-yellow", "chip-green"] as const;

export default function InterestChips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((label, i) => {
        const colorClass = COLOR_CLASSES[i % 4];
        // Stagger entrance; float starts after entrance completes, offset per chip for wave
        const enterDelay = i * 70;
        const floatDelay = 500 + i * 180;
        return (
          <span
            key={i}
            className={`font-mono text-xs px-3 py-1 rounded-full border ${colorClass}`}
            style={{
              opacity: 0,
              animation: `chip-enter 0.4s ease ${enterDelay}ms forwards, chip-float 2.8s ease-in-out ${floatDelay}ms infinite`,
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
