import Image from "next/image";
import { getCurrentStudio } from "@/lib/dal";
import { db } from "@/lib/db";
import { UploadForm } from "./upload-form";
import { DeleteButton } from "./delete-button";
import { RoleButtons } from "./role-buttons";

export default async function DashboardPhotosPage() {
  const studio = await getCurrentStudio();
  if (!studio) return null;

  const photos = await db.photo.findMany({
    where: { studioId: studio.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Portfolio photos</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Photos appear in your public portfolio grid, grouped by category as albums. Mark one photo as
        Hero and one as About to control your page&apos;s featured images.
      </p>

      <div className="mt-8">
        <UploadForm />
      </div>

      {photos.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">No photos yet — upload your first one above.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                <Image src={photo.url} alt={photo.title} fill sizes="25vw" className="object-cover" />
                <DeleteButton photoId={photo.id} />
              </div>
              <p className="mt-2 text-xs text-ink">{photo.title}</p>
              <p className="text-[11px] text-ink-soft">{photo.category}</p>
              <RoleButtons photoId={photo.id} role={photo.role} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
