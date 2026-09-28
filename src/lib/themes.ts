export const BOOK_THEMES = {
  olive: {
    label: "Olive kitchen",
    cover: "#2f4d38",
    paper: "#f6f1e8",
    ink: "#2a241c",
    accent: "#9d432c",
    edge: "#1e3326",
  },
  berry: {
    label: "Berry",
    cover: "#6b2d4a",
    paper: "#fbf4f6",
    ink: "#2c1822",
    accent: "#a33b5a",
    edge: "#4a1d32",
  },
  navy: {
    label: "Navy and gold",
    cover: "#1e3354",
    paper: "#f4f7fb",
    ink: "#1a2433",
    accent: "#b0893e",
    edge: "#121e33",
  },
  warm: {
    label: "Warm paper",
    cover: "#8a5a32",
    paper: "#fbf6ee",
    ink: "#2a241c",
    accent: "#9d432c",
    edge: "#5c3b20",
  },
} as const;

export type BookThemeId = keyof typeof BOOK_THEMES;

export const COVER_COLORS = [
  "#2f4d38",
  "#6b2d4a",
  "#1e3354",
  "#8a5a32",
  "#3d4f3a",
  "#7a3e2e",
] as const;

export const SHELF_STAINS = {
  honey: {
    label: "Honey",
    wall: "#e7d3b0",
    plank: "#c4924a",
    plankDark: "#8d6230",
  },
  walnut: {
    label: "Walnut",
    wall: "#d7c4a8",
    plank: "#6b4423",
    plankDark: "#3e2714",
  },
  cherry: {
    label: "Cherry",
    wall: "#e6cfc0",
    plank: "#8b3a32",
    plankDark: "#5c241e",
  },
  whitewash: {
    label: "Whitewash",
    wall: "#efe6d6",
    plank: "#d9cbb6",
    plankDark: "#b7a48c",
  },
} as const;

export type ShelfStainId = keyof typeof SHELF_STAINS;

export function themeFor(id: string) {
  if (id in BOOK_THEMES) {
    return BOOK_THEMES[id as BookThemeId];
  }
  return BOOK_THEMES.olive;
}

export function isThemeId(value: string): value is BookThemeId {
  return value in BOOK_THEMES;
}

export function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}
