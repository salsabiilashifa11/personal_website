"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

type Mood = "happy" | "blink" | "surprised" | "look-left" | "look-right";

const P = 2; // 2px per pixel — 15×12 grid = 30×24px

const K = "#1a2d5a"; // dark google-blue outer outline
const A = "#4285F4"; // google blue inner outline
const O = "#A8C4FB"; // pastel google blue body
const L = "#D5E3FE"; // light blue highlight
const D = "#1a2d5a"; // eye dark
const S = "#ffffff"; // eye shine
const C = "#FFB3C6"; // pastel pink blush
const M = "#1a2d5a"; // mouth
const _ = null;

// 15 cols × 12 rows
// Structure: K (outer) → A (inner ring) → O (body) / L (highlight)
const BASE: (string | null)[][] = [
  [_,_,_,K,K,K,K,K,K,K,K,K,_,_,_],
  [_,_,K,A,A,A,A,A,A,A,A,A,K,_,_],
  [_,K,A,A,L,L,L,L,A,A,A,A,A,K,_],
  [K,A,A,L,L,L,L,L,A,A,A,A,A,A,K],
  [K,A,A,L,L,L,A,A,A,A,A,A,A,A,K],
  [K,A,O,O,O,O,O,O,O,O,O,O,O,A,K],
  [K,A,O,O,O,O,O,O,O,O,O,O,O,A,K],
  [K,A,O,O,O,O,O,O,O,O,O,O,O,A,K],
  [K,A,O,O,O,O,O,O,O,O,O,O,O,A,K],
  [K,A,O,O,O,O,O,O,O,O,O,O,O,A,K],
  [_,K,A,A,A,A,A,A,A,A,A,A,A,K,_],
  [_,_,K,K,K,K,K,K,K,K,K,K,K,_,_],
];

type FP = [number, number, string];

function getFace(mood: Mood): FP[] {
  // left eye: cols 4-5 rows 5-7 | right eye: cols 9-10 rows 5-7
  const cheeks: FP[] = [[3,8,C],[11,8,C]];

  switch (mood) {
    case "blink":
      return [
        [4,6,D],[5,6,D],[9,6,D],[10,6,D],
        ...cheeks,
        [6,8,M],[7,8,M],[8,8,M],
      ];

    case "surprised":
      return [
        [4,5,D],[5,5,S],[9,5,D],[10,5,S],
        [4,6,D],[5,6,D],[9,6,D],[10,6,D],
        [4,7,D],[5,7,D],[9,7,D],[10,7,D],
        ...cheeks,
        [5,8,M],[6,8,M],[7,8,M],[8,8,M],[9,8,M],
        [5,9,M],[9,9,M],
      ];

    case "look-left":
      return [
        [4,5,S],[5,5,D],[9,5,S],[10,5,D],
        [4,6,D],[5,6,D],[9,6,D],[10,6,D],
        [4,7,D],[5,7,D],[9,7,D],[10,7,D],
        ...cheeks,
        [6,8,M],[7,8,M],[8,8,M],
      ];

    default: // happy + look-right
      return [
        [4,5,D],[5,5,S],[9,5,D],[10,5,S],
        [4,6,D],[5,6,D],[9,6,D],[10,6,D],
        [4,7,D],[5,7,D],[9,7,D],[10,7,D],
        ...cheeks,
        [6,8,M],[7,8,M],[8,8,M],
      ];
  }
}

function Slime({ mood }: { mood: Mood }) {
  const face = new Map(getFace(mood).map(([c, r, col]) => [`${c},${r}`, col]));
  return (
    <svg
      width={15 * P}
      height={12 * P}
      style={{ display: "block", imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {BASE.flatMap((row, r) =>
        row.map((base, c) => {
          const fill = face.get(`${c},${r}`) ?? base;
          if (!fill) return null;
          return <rect key={`${r}-${c}`} x={c * P} y={r * P} width={P} height={P} fill={fill} />;
        })
      )}
    </svg>
  );
}

export default function BlobCharacter() {
  const [mood, setMood] = useState<Mood>("happy");
  const controls = useAnimation();

  useEffect(() => {
    let alive = true;
    const loop = async () => {
      while (alive) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
        if (!alive) break;
        await controls.start({
          y: [0, -10, 0, -3, 0],
          scaleX: [1, 0.83, 1.16, 0.95, 1],
          scaleY: [1, 1.16, 0.84, 1.05, 1],
          transition: { duration: 0.48, ease: "easeOut" },
        });
      }
    };
    loop();
    return () => { alive = false; };
  }, [controls]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const MOODS: Mood[] = ["blink","blink","look-left","look-right","surprised","blink"];
    const schedule = () => {
      timer = setTimeout(() => {
        const next = MOODS[Math.floor(Math.random() * MOODS.length)];
        setMood(next);
        setTimeout(() => setMood("happy"), next === "surprised" ? 750 : 280);
        schedule();
      }, 2000 + Math.random() * 3000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.span
      animate={controls}
      whileHover={{ scale: 1.25 }}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginLeft: 10,
        transformOrigin: "bottom center",
        cursor: "default",
      }}
      aria-hidden="true"
    >
      <Slime mood={mood} />
    </motion.span>
  );
}
