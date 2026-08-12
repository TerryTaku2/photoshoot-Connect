import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Portfolio } from "@/components/Portfolio";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { BookingSection } from "./booking-section";

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const studio = await db.studio.findUnique({
    where: { slug },
    include: { photos: { orderBy: { createdAt: "desc" } } },
  });

  if (!studio) notFound();

  const heroPhoto = studio.photos.find((p) => p.role === "hero") ?? studio.photos[0];
  const aboutPhoto =
    studio.photos.find((p) => p.role === "about") ??
    studio.photos.find((p) => p.id !== heroPhoto?.id) ??
    studio.photos[0];

  const portfolioPhotos = studio.photos.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    url: p.url,
  }));

  const themeStyle = {
    "--canvas": studio.canvasColor,
    "--ink": studio.primaryColor,
    "--accent": studio.accentColor,
  } as React.CSSProperties;

  return (
    <div style={themeStyle} className="flex min-h-screen flex-col bg-canvas text-ink">
      <Nav brandName={studio.brandName} />
      <main className="flex-1">
        <Hero tagline={studio.tagline} photoUrl={heroPhoto?.url} />

        {studio.layout === "grid-first" && (
          <>
            <Portfolio photos={portfolioPhotos} large />
            <About description={studio.description} location={studio.location} photoUrl={aboutPhoto?.url} />
          </>
        )}

        {studio.layout === "minimal" && <Portfolio photos={portfolioPhotos} showHeading={false} showLabels={false} />}

        {studio.layout !== "grid-first" && studio.layout !== "minimal" && (
          <>
            <About description={studio.description} location={studio.location} photoUrl={aboutPhoto?.url} />
            <Portfolio photos={portfolioPhotos} />
          </>
        )}

        <BookingSection studio={studio} />
      </main>
      <Footer brandName={studio.brandName} />
      <ChatWidget studio={studio} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studio = await db.studio.findUnique({ where: { slug } });
  return { title: studio ? `${studio.brandName} — Photography` : "Studio not found" };
}
