import { getCurrentStudio } from "@/lib/dal";
import { StudioForm } from "./studio-form";
import { LayoutPicker } from "./layout-picker";

export default async function DashboardStudioPage() {
  const studio = await getCurrentStudio();
  if (!studio) return null;

  return (
    <div>
      <section className="max-w-4xl">
        <h1 className="font-serif text-3xl text-ink">Layout</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Choose how your public page is arranged. You can change this anytime.
        </p>
        <div className="mt-8">
          <LayoutPicker current={studio.layout} />
        </div>
      </section>

      <section className="mt-16 max-w-2xl border-t border-line pt-12">
        <h1 className="font-serif text-3xl text-ink">Studio settings</h1>
        <p className="mt-2 text-sm text-ink-soft">
          This information appears on your public page.
        </p>
        <div className="mt-8">
          <StudioForm studio={studio} />
        </div>
      </section>
    </div>
  );
}
