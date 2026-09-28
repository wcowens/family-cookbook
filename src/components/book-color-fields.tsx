"use client";

import { useState } from "react";
import { BOOK_THEMES, themeFor, type BookThemeId } from "@/lib/themes";

export function BookColorFields({
  theme,
  coverColor,
  paperColor,
  accentColor,
}: {
  theme: string;
  coverColor: string;
  paperColor: string;
  accentColor: string;
}) {
  const starting = themeFor(theme);
  const [choice, setChoice] = useState({
    theme: theme in BOOK_THEMES ? theme : "olive",
    cover: coverColor || starting.cover,
    paper: paperColor || starting.paper,
    accent: accentColor || starting.accent,
  });

  function pickTheme(id: BookThemeId) {
    const next = themeFor(id);
    setChoice({ theme: id, cover: next.cover, paper: next.paper, accent: next.accent });
  }

  return (
    <>
      <fieldset className="space-y-2">
        <legend className="field-label">Start from a theme</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(BOOK_THEMES).map(([id, item]) => (
            <label key={id} className="flex items-center gap-3 rounded-2xl border border-line px-3 py-2">
              <input
                type="radio"
                name="theme"
                value={id}
                checked={choice.theme === id}
                onChange={() => pickTheme(id as BookThemeId)}
              />
              <span className="h-6 w-6 rounded-full" style={{ background: item.cover }} />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="field-label">Spine color</span>
          <input
            type="color"
            name="coverColor"
            value={choice.cover}
            onChange={(event) => setChoice((current) => ({ ...current, cover: event.target.value }))}
            className="h-12 w-full cursor-pointer rounded-xl border border-line bg-white"
          />
        </label>
        <label className="space-y-2">
          <span className="field-label">Page color</span>
          <input
            type="color"
            name="paperColor"
            value={choice.paper}
            onChange={(event) => setChoice((current) => ({ ...current, paper: event.target.value }))}
            className="h-12 w-full cursor-pointer rounded-xl border border-line bg-white"
          />
        </label>
        <label className="space-y-2">
          <span className="field-label">Accent color</span>
          <input
            type="color"
            name="accentColor"
            value={choice.accent}
            onChange={(event) => setChoice((current) => ({ ...current, accent: event.target.value }))}
            className="h-12 w-full cursor-pointer rounded-xl border border-line bg-white"
          />
        </label>
      </div>
    </>
  );
}
