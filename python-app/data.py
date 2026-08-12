PLATFORM = {
    "name": "T-Tech Connect",
    "tagline": "The booking platform built for photographers.",
    "description": (
        "Get a branded studio website, client bookings, and a portfolio you control "
        "— all in one subscription."
    ),
}

PLANS = [
    {
        "id": "starter",
        "name": "Starter",
        "price": "$9",
        "period": "/mo",
        "description": "A branded page and bookings to get started.",
        "features": ["Branded studio page", "Custom theme colors", "Up to 12 portfolio photos", "Booking requests"],
        "highlighted": False,
    },
    {
        "id": "pro",
        "name": "Pro",
        "price": "$24",
        "period": "/mo",
        "description": "For studios booking regularly.",
        "features": [
            "Everything in Starter",
            "Unlimited portfolio photos",
            "Booking calendar & reminders",
            "Client chatbot widget",
        ],
        "highlighted": True,
    },
    {
        "id": "studio",
        "name": "Studio",
        "price": "$49",
        "period": "/mo",
        "description": "For teams and multi-photographer studios.",
        "features": ["Everything in Pro", "Team member accounts", "Priority support", "Custom domain (coming soon)"],
        "highlighted": False,
    },
]

FEATURES = [
    {
        "title": "Branded studio page",
        "description": "A polished, mobile-ready photography website under your own name — no design work needed.",
    },
    {
        "title": "Your own theme colors",
        "description": "Pick the palette that matches your brand. Changes apply across your whole public page instantly.",
    },
    {
        "title": "Booking requests",
        "description": "Clients request sessions straight from your page. Confirm or decline from your dashboard.",
    },
    {
        "title": "Upcoming-event reminders",
        "description": "Bookings within the next 7 days are flagged in your dashboard so nothing slips through.",
    },
    {
        "title": "Client chatbot",
        "description": "An assistant on your page answers common questions about pricing, booking, and location.",
    },
    {
        "title": "Portfolio management",
        "description": "Upload and organize your work — it shows up in your public portfolio grid automatically.",
    },
]

LAYOUTS = [
    {
        "id": "classic",
        "name": "Classic",
        "description": "Full-bleed hero, then About, then a labeled portfolio grid, then booking.",
    },
    {
        "id": "grid-first",
        "name": "Grid First",
        "description": "Leads with your portfolio grid right under a short hero — best if the work should speak first.",
    },
    {
        "id": "minimal",
        "name": "Minimal",
        "description": "Quieter hero, no About section, plain unlabeled grid. Text-light and gallery-focused.",
    },
]
LAYOUT_IDS = {layout["id"] for layout in LAYOUTS}

PALETTES = [
    {"name": "Warm Neutral", "primary_color": "#1b1917", "accent_color": "#9c7a4f", "canvas_color": "#faf8f5"},
    {"name": "Black & Gold", "primary_color": "#141414", "accent_color": "#c9a13b", "canvas_color": "#f7f5f0"},
    {"name": "Emerald Studio", "primary_color": "#14251d", "accent_color": "#3f7d5c", "canvas_color": "#f2f7f4"},
    {"name": "Midnight Blue", "primary_color": "#12182b", "accent_color": "#5b7fdb", "canvas_color": "#f4f6fb"},
    {"name": "Blush & Rose", "primary_color": "#2b1a1f", "accent_color": "#c97b8a", "canvas_color": "#fdf5f6"},
    {"name": "Terracotta", "primary_color": "#2b1f18", "accent_color": "#c1652f", "canvas_color": "#faf3ec"},
    {"name": "Charcoal & Copper", "primary_color": "#1c1c1c", "accent_color": "#b56a4a", "canvas_color": "#f5f3f0"},
    {"name": "Sage & Cream", "primary_color": "#21261f", "accent_color": "#7a9471", "canvas_color": "#f7f6ee"},
    {"name": "Slate & Sky", "primary_color": "#1b232c", "accent_color": "#5c98b8", "canvas_color": "#f3f7f9"},
    {"name": "Plum", "primary_color": "#241422", "accent_color": "#8c4f8a", "canvas_color": "#f8f3f7"},
]
