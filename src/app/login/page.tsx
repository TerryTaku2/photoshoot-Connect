"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="font-serif text-lg text-ink">
          T-Tech Connect
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-soft">Log in to manage your studio.</p>

        <form action={action} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm text-ink-soft" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-soft" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-ink outline-none focus:border-accent"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Don&apos;t have a studio yet?{" "}
          <Link href="/signup" className="text-ink underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
