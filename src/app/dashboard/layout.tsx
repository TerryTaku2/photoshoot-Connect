import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentStudio, getCurrentUser } from "@/lib/dal";
import { logout } from "@/app/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Studio" },
  { href: "/dashboard/photos", label: "Photos" },
  { href: "/dashboard/bookings", label: "Bookings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, studio] = await Promise.all([getCurrentUser(), getCurrentStudio()]);
  if (!user || !studio) redirect("/login");

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-lg text-ink">
              T-Tech Connect
            </Link>
            <nav className="flex items-center gap-6 text-sm text-ink-soft">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href={`/studio/${studio.slug}`} target="_blank" className="text-ink-soft hover:text-ink">
              View live site ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="text-ink-soft hover:text-ink">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}
