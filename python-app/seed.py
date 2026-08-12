"""Creates the demo studio used by the Next.js version's seed script, for parity."""

from app import create_app
from auth import hash_password
from db import get_db
from utils import new_id

EMAIL = "demo@aperture-co.com"
PASSWORD = "password123"


def main():
    app = create_app()
    with app.app_context():
        database = get_db()
        existing = database.execute("SELECT 1 FROM users WHERE email = ?", (EMAIL,)).fetchone()
        if existing:
            print("Demo studio already seeded.")
            return

        user_id = new_id()
        studio_id = new_id()
        database.execute(
            "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)",
            (user_id, EMAIL, hash_password(PASSWORD), "Demo Photographer"),
        )
        database.execute(
            """INSERT INTO studios
                (id, owner_id, slug, brand_name, tagline, description, email, phone, location,
                 instagram, plan)
               VALUES (?, ?, 'aperture-co', 'Aperture & Co.', ?, ?, 'hello@aperture-co.com',
                       '+1 (555) 012-3456', 'Based in New York, available worldwide',
                       'https://instagram.com', 'pro')""",
            (
                studio_id,
                user_id,
                "Photography that feels like a memory you already had.",
                "Aperture & Co. is a photography studio specializing in portrait, graduation, and "
                "professional sessions — crafted with care from the first frame to the final print.",
            ),
        )
        for url, title, category in [
            ("/static/photos/graduation-seated.jpg", "Class of 2026", "Graduation"),
            ("/static/photos/graduation-headshot.jpg", "Studio Headshot", "Graduation"),
            ("/static/photos/professional-standing.jpg", "Professional Portrait", "Portrait"),
        ]:
            database.execute(
                "INSERT INTO photos (id, studio_id, url, title, category) VALUES (?, ?, ?, ?, ?)",
                (new_id(), studio_id, url, title, category),
            )
        database.commit()
        print(f"Seeded demo studio for user {EMAIL} (password: {PASSWORD})")


if __name__ == "__main__":
    main()
