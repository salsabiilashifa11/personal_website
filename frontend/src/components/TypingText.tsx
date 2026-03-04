"use client";

import { useState, useEffect } from "react";

const TYPE_SPEED = 65;   // ms per character when typing
const DELETE_SPEED = 35; // ms per character when deleting
const PAUSE_END = 1800;  // ms to hold the completed word before deleting
const PAUSE_START = 300; // ms to pause on empty string before typing next

interface Props {
  items: string[];
}

export default function TypingText({ items }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [pausing, setPausing] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const target = items[index];

    if (pausing) {
      const id = setTimeout(() => {
        setPausing(false);
        // If we just finished typing, start deleting. If we just finished deleting, start typing.
        if (deleting) {
          setDeleting(false);
          setIndex((i) => (i + 1) % items.length);
        } else {
          setDeleting(true);
        }
      }, deleting ? PAUSE_START : PAUSE_END);
      return () => clearTimeout(id);
    }

    if (!deleting && displayed === target) {
      // Finished typing — pause before deleting
      setPausing(true);
      return;
    }

    if (deleting && displayed === "") {
      // Finished deleting — pause before next word
      setPausing(true);
      return;
    }

    const id = setTimeout(() => {
      setDisplayed(deleting
        ? target.slice(0, displayed.length - 1)
        : target.slice(0, displayed.length + 1)
      );
    }, deleting ? DELETE_SPEED : TYPE_SPEED);

    return () => clearTimeout(id);
  }, [displayed, index, deleting, pausing, items]);

  if (items.length === 0) return null;

  return (
    <span className="font-mono text-base text-gray-500">
      {displayed}
      <span className="inline-block w-0.5 h-4 bg-google-blue ml-0.5 align-middle animate-pulse" />
    </span>
  );
}
