export const platform = {
  name: "T-Tech Connect",
  tagline: "The booking platform built for photographers.",
  description:
    "Get a branded studio website, client bookings, and a portfolio you control — all in one subscription.",
};

export const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$9",
    period: "/mo",
    description: "A branded page and bookings to get started.",
    features: ["Branded studio page", "Custom theme colors", "Up to 12 portfolio photos", "Booking requests"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$24",
    period: "/mo",
    description: "For studios booking regularly.",
    features: [
      "Everything in Starter",
      "Unlimited portfolio photos",
      "Booking calendar & reminders",
      "Client chatbot widget",
    ],
    highlighted: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: "$49",
    period: "/mo",
    description: "For teams and multi-photographer studios.",
    features: ["Everything in Pro", "Team member accounts", "Priority support", "Custom domain (coming soon)"],
    highlighted: false,
  },
] as const;
