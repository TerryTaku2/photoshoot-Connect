export type Palette = {
  name: string;
  primaryColor: string;
  accentColor: string;
  canvasColor: string;
};

export const palettes: Palette[] = [
  { name: "Warm Neutral", primaryColor: "#1b1917", accentColor: "#9c7a4f", canvasColor: "#faf8f5" },
  { name: "Black & Gold", primaryColor: "#141414", accentColor: "#c9a13b", canvasColor: "#f7f5f0" },
  { name: "Emerald Studio", primaryColor: "#14251d", accentColor: "#3f7d5c", canvasColor: "#f2f7f4" },
  { name: "Midnight Blue", primaryColor: "#12182b", accentColor: "#5b7fdb", canvasColor: "#f4f6fb" },
  { name: "Blush & Rose", primaryColor: "#2b1a1f", accentColor: "#c97b8a", canvasColor: "#fdf5f6" },
  { name: "Terracotta", primaryColor: "#2b1f18", accentColor: "#c1652f", canvasColor: "#faf3ec" },
  { name: "Charcoal & Copper", primaryColor: "#1c1c1c", accentColor: "#b56a4a", canvasColor: "#f5f3f0" },
  { name: "Sage & Cream", primaryColor: "#21261f", accentColor: "#7a9471", canvasColor: "#f7f6ee" },
  { name: "Slate & Sky", primaryColor: "#1b232c", accentColor: "#5c98b8", canvasColor: "#f3f7f9" },
  { name: "Plum", primaryColor: "#241422", accentColor: "#8c4f8a", canvasColor: "#f8f3f7" },
];
