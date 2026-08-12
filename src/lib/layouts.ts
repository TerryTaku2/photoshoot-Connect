export type LayoutId = "classic" | "grid-first" | "minimal";

export const layouts: { id: LayoutId; name: string; description: string }[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Full-bleed hero, then About, then a labeled portfolio grid, then booking.",
  },
  {
    id: "grid-first",
    name: "Grid First",
    description: "Leads with your portfolio grid right under a short hero — best if the work should speak first.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Quieter hero, no About section, plain unlabeled grid. Text-light and gallery-focused.",
  },
];
