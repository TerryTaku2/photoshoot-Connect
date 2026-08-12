"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { plans } from "@/lib/platform-config";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get("plan") || "starter";

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="font-serif text-lg text-ink">
          T-Tech Connect
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-ink">Start your studio</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Create an account to get your branded photography page.
        </p>

        <form action={action} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm text-ink-soft" htmlFor="name">
              Your name
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-soft" htmlFor="brandName">
              Studio / brand name
            </label>
            <input
              id="brandName"
              name="brandName"
              required
              placeholder="e.g. Aperture & Co."
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-ink outline-none focus:border-accent"
            />
          </div>
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
              minLength={8}
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-ink outline-none focus:border-accent"
            />
          </div>

          <fieldset>
            <legend className="block text-sm text-ink-soft">Plan</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {plans.map((plan) => (
                <label
                  key={plan.id}
                  className="flex cursor-pointer flex-col items-center rounded-sm border border-line px-2 py-3 text-center has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    defaultChecked={plan.id === preselectedPlan}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-ink">{plan.name}</span>
                  <span className="text-xs text-ink-soft">{plan.price}{plan.period}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Creating your studio…" : "Create studio"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline underline-offset-4">
            Log in
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-ink-soft">
          Billing isn&apos;t connected yet — plans are free while T-Tech Connect is in beta.
        </p>
      </div>
    </main>
  );
}
