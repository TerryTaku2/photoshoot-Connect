"use client";

import { useState } from "react";

type Message = { from: "bot" | "user"; text: string };

type StudioInfo = {
  brandName: string;
  email: string;
  phone: string;
  location: string;
};

function answerFor(question: string, studio: StudioInfo): string {
  const q = question.toLowerCase();

  if (/(price|cost|rate|how much)/.test(q)) {
    return `Pricing depends on the session type — send a booking request below with what you have in mind and ${studio.brandName} will follow up with a quote.`;
  }
  if (/(book|availab|schedule|date)/.test(q)) {
    return "You can request a booking using the form in the Contact section — include your preferred date and details.";
  }
  if (/(where|location|based)/.test(q)) {
    return studio.location ? `${studio.brandName} is based in ${studio.location}.` : `Check the Contact section for location details.`;
  }
  if (/(contact|email|phone|call)/.test(q)) {
    const parts = [studio.email, studio.phone].filter(Boolean).join(" or ");
    return parts ? `You can reach ${studio.brandName} at ${parts}.` : "See the Contact section below for details.";
  }
  if (/(hi|hello|hey)/.test(q)) {
    return `Hi! I'm the ${studio.brandName} assistant. Ask me about pricing, booking, or location.`;
  }
  return "I'm not sure about that yet — try asking about pricing, booking, or location, or use the contact form below.";
}

export function ChatWidget({ studio }: { studio: StudioInfo }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: `Hi! I'm the ${studio.brandName} assistant. Ask me about pricing, booking, or location.` },
  ]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const reply = answerFor(text, studio);
    setMessages((prev) => [...prev, { from: "user", text }, { from: "bot", text: reply }]);
    setInput("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col rounded-sm border border-line bg-canvas shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-medium text-ink">{studio.brandName} assistant</p>
            <button type="button" onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink">
              ✕
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-sm px-3 py-2 text-sm ${
                  m.from === "bot" ? "bg-black/[0.04] text-ink" : "ml-auto bg-ink text-canvas"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question…"
              className="flex-1 rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-full bg-ink px-4 py-2 text-sm text-canvas hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas shadow-lg hover:opacity-90"
        aria-label="Open chat"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    </div>
  );
}
