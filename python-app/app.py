import os
from datetime import datetime, timedelta
from pathlib import Path

from flask import (
    Flask,
    abort,
    flash,
    g,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from werkzeug.utils import secure_filename

import auth
import data
import db as db_module
from utils import new_id, slugify

ALLOWED_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
MAX_UPLOAD_SIZE = 8 * 1024 * 1024
EMAIL_RE = auth.EMAIL_RE


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SESSION_SECRET", "dev-secret-change-me"),
        DATABASE=os.environ.get("DATABASE_URL", str(Path(app.instance_path) / "dev.db")),
        UPLOADS_DIR=os.environ.get("UPLOADS_DIR", str(Path(app.root_path) / "uploads")),
        MAX_CONTENT_LENGTH=MAX_UPLOAD_SIZE,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=os.environ.get("FLASK_ENV") == "production",
        PERMANENT_SESSION_LIFETIME=timedelta(days=30),
    )
    if test_config:
        app.config.update(test_config)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    Path(app.config["UPLOADS_DIR"]).mkdir(parents=True, exist_ok=True)

    db_module.init_app(app)
    auth.init_app(app)

    with app.app_context():
        db_module.init_db()

    register_routes(app)
    return app


def register_routes(app):
    @app.context_processor
    def inject_platform():
        return {"platform": data.PLATFORM}

    @app.template_filter("format_date")
    def format_date_filter(value):
        try:
            parsed = datetime.strptime(value, "%Y-%m-%d")
        except (TypeError, ValueError):
            return value
        return parsed.strftime("%B %d, %Y")

    @app.template_global()
    def is_upcoming(event_date_str):
        try:
            parsed = datetime.strptime(event_date_str, "%Y-%m-%d")
        except (TypeError, ValueError):
            return False
        days = (parsed - datetime.now()).days
        return 0 <= days <= 7

    # ---- marketing / auth ---------------------------------------------

    @app.route("/")
    def home():
        return render_template(
            "landing.html", platform=data.PLATFORM, plans=data.PLANS, features=data.FEATURES
        )

    @app.route("/signup", methods=["GET", "POST"])
    def signup():
        if g.user:
            return redirect(url_for("dashboard"))

        preselected_plan = request.args.get("plan", "starter")
        error = None

        if request.method == "POST":
            name = request.form.get("name", "").strip()
            brand_name = request.form.get("brandName", "").strip()
            email = request.form.get("email", "").strip().lower()
            password = request.form.get("password", "")
            plan_input = request.form.get("plan", "starter")
            plan = plan_input if plan_input in {"starter", "pro", "studio"} else "starter"
            preselected_plan = plan

            database = db_module.get_db()
            if len(name) < 2:
                error = "Please enter your name."
            elif len(brand_name) < 2:
                error = "Please enter a studio name."
            elif not EMAIL_RE.match(email):
                error = "Please enter a valid email."
            elif len(password) < 8:
                error = "Password must be at least 8 characters."
            elif database.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone():
                error = "An account with that email already exists."

            if error is None:
                slug = _unique_slug(database, brand_name)
                user_id = new_id()
                studio_id = new_id()
                database.execute(
                    "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)",
                    (user_id, email, auth.hash_password(password), name),
                )
                database.execute(
                    """INSERT INTO studios
                        (id, owner_id, slug, brand_name, tagline, description, email, phone, location, plan)
                       VALUES (?, ?, ?, ?, ?, ?, ?, '', '', ?)""",
                    (
                        studio_id,
                        user_id,
                        slug,
                        brand_name,
                        "Photography that feels like a memory you already had.",
                        f"{brand_name} is a photography studio crafting images worth keeping.",
                        email,
                        plan,
                    ),
                )
                database.commit()
                auth.create_session(user_id)
                return redirect(url_for("dashboard"))

        return render_template(
            "signup.html", plans=data.PLANS, preselected_plan=preselected_plan, error=error
        )

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if g.user:
            return redirect(url_for("dashboard"))

        error = None
        if request.method == "POST":
            email = request.form.get("email", "").strip().lower()
            password = request.form.get("password", "")

            database = db_module.get_db()
            user = database.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
            if user is None or not auth.verify_password(password, user["password_hash"]):
                error = "Invalid email or password."
            else:
                auth.create_session(user["id"])
                return redirect(url_for("dashboard"))

        return render_template("login.html", error=error)

    @app.route("/logout", methods=["POST"])
    def logout():
        auth.destroy_session()
        return redirect(url_for("login"))

    # ---- dashboard: studio settings + layout ---------------------------

    @app.route("/dashboard", methods=["GET", "POST"])
    @auth.login_required
    def dashboard():
        database = db_module.get_db()
        error = success = None

        if request.method == "POST":
            brand_name = request.form.get("brandName", "").strip()
            tagline = request.form.get("tagline", "").strip()
            description = request.form.get("description", "").strip()
            email = request.form.get("email", "").strip()
            phone = request.form.get("phone", "").strip()
            location = request.form.get("location", "").strip()
            instagram = request.form.get("instagram", "").strip()
            primary_color = request.form.get("primaryColor", "#1b1917")
            accent_color = request.form.get("accentColor", "#9c7a4f")
            canvas_color = request.form.get("canvasColor", "#faf8f5")

            hex_re = auth.re.compile(r"^#[0-9a-fA-F]{6}$")
            if len(brand_name) < 2:
                error = "Studio name is too short."
            elif not all(hex_re.match(c) for c in (primary_color, accent_color, canvas_color)):
                error = "Theme colors must be valid hex values."
            else:
                database.execute(
                    """UPDATE studios SET brand_name=?, tagline=?, description=?, email=?, phone=?,
                       location=?, instagram=?, primary_color=?, accent_color=?, canvas_color=?
                       WHERE id=?""",
                    (
                        brand_name,
                        tagline,
                        description,
                        email,
                        phone,
                        location,
                        instagram,
                        primary_color,
                        accent_color,
                        canvas_color,
                        g.studio["id"],
                    ),
                )
                database.commit()
                success = True
                g.studio = database.execute(
                    "SELECT * FROM studios WHERE id = ?", (g.studio["id"],)
                ).fetchone()

        return render_template(
            "dashboard/studio.html",
            studio=g.studio,
            layouts=data.LAYOUTS,
            palettes=data.PALETTES,
            error=error,
            success=success,
        )

    @app.route("/dashboard/layout", methods=["POST"])
    @auth.login_required
    def update_layout():
        layout = request.form.get("layout", "")
        if layout in data.LAYOUT_IDS:
            database = db_module.get_db()
            database.execute("UPDATE studios SET layout = ? WHERE id = ?", (layout, g.studio["id"]))
            database.commit()
        return redirect(url_for("dashboard"))

    # ---- dashboard: photos ----------------------------------------------

    @app.route("/dashboard/photos", methods=["GET", "POST"])
    @auth.login_required
    def dashboard_photos():
        database = db_module.get_db()
        error = None

        if request.method == "POST":
            error = _handle_photo_upload(database)

        photos = database.execute(
            "SELECT * FROM photos WHERE studio_id = ? ORDER BY created_at DESC", (g.studio["id"],)
        ).fetchall()
        return render_template("dashboard/photos.html", photos=photos, error=error)

    def _handle_photo_upload(database):
        file = request.files.get("file")
        title = request.form.get("title", "").strip()
        category = request.form.get("category", "").strip() or "Portfolio"

        if file is None or file.filename == "":
            return "Choose an image file."
        if file.mimetype not in ALLOWED_TYPES:
            return "Only JPEG, PNG, or WebP images are allowed."
        if not title:
            return "Give the photo a title."

        ext = ALLOWED_TYPES[file.mimetype]
        filename = f"{int(datetime.now().timestamp() * 1000)}-{new_id()[:6]}.{ext}"
        studio_dir = Path(g.app_config_uploads_dir) / g.studio["id"]
        studio_dir.mkdir(parents=True, exist_ok=True)
        file.save(studio_dir / secure_filename(filename))

        database.execute(
            "INSERT INTO photos (id, studio_id, url, title, category) VALUES (?, ?, ?, ?, ?)",
            (new_id(), g.studio["id"], f"/uploads/{g.studio['id']}/{filename}", title, category),
        )
        database.commit()
        return None

    @app.route("/dashboard/photos/<photo_id>/role", methods=["POST"])
    @auth.login_required
    def set_photo_role(photo_id):
        role = request.form.get("role", "")
        if role not in {"hero", "about", "gallery"}:
            abort(400)

        database = db_module.get_db()
        photo = database.execute("SELECT * FROM photos WHERE id = ?", (photo_id,)).fetchone()
        if photo is None or photo["studio_id"] != g.studio["id"]:
            abort(404)

        if role in {"hero", "about"}:
            database.execute(
                "UPDATE photos SET role = 'gallery' WHERE studio_id = ? AND role = ?",
                (g.studio["id"], role),
            )
        database.execute("UPDATE photos SET role = ? WHERE id = ?", (role, photo_id))
        database.commit()
        return redirect(url_for("dashboard_photos"))

    @app.route("/dashboard/photos/<photo_id>/delete", methods=["POST"])
    @auth.login_required
    def delete_photo(photo_id):
        database = db_module.get_db()
        photo = database.execute("SELECT * FROM photos WHERE id = ?", (photo_id,)).fetchone()
        if photo is None or photo["studio_id"] != g.studio["id"]:
            abort(404)

        database.execute("DELETE FROM photos WHERE id = ?", (photo_id,))
        database.commit()

        file_path = Path(g.app_config_uploads_dir) / photo["url"].removeprefix("/uploads/")
        file_path.unlink(missing_ok=True)
        return redirect(url_for("dashboard_photos"))

    # ---- dashboard: bookings ---------------------------------------------

    @app.route("/dashboard/bookings")
    @auth.login_required
    def dashboard_bookings():
        database = db_module.get_db()
        bookings = database.execute(
            "SELECT * FROM bookings WHERE studio_id = ? ORDER BY event_date ASC", (g.studio["id"],)
        ).fetchall()
        return render_template("dashboard/bookings.html", bookings=bookings)

    @app.route("/dashboard/bookings/<booking_id>/status", methods=["POST"])
    @auth.login_required
    def update_booking_status(booking_id):
        status = request.form.get("status", "")
        if status not in {"confirmed", "declined"}:
            abort(400)

        database = db_module.get_db()
        booking = database.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,)).fetchone()
        if booking is None or booking["studio_id"] != g.studio["id"]:
            abort(404)

        database.execute("UPDATE bookings SET status = ? WHERE id = ?", (status, booking_id))
        database.commit()
        return redirect(url_for("dashboard_bookings"))

    # ---- public studio site ----------------------------------------------

    @app.route("/studio/<slug>")
    def studio_page(slug):
        database = db_module.get_db()
        studio = database.execute("SELECT * FROM studios WHERE slug = ?", (slug,)).fetchone()
        if studio is None:
            abort(404)

        photos = database.execute(
            "SELECT * FROM photos WHERE studio_id = ? ORDER BY created_at DESC", (studio["id"],)
        ).fetchall()

        hero_photo = next((p for p in photos if p["role"] == "hero"), photos[0] if photos else None)
        about_photo = next(
            (p for p in photos if p["role"] == "about"),
            next((p for p in photos if not hero_photo or p["id"] != hero_photo["id"]), photos[0] if photos else None),
        )
        categories = sorted({p["category"] for p in photos if p["category"]})

        return render_template(
            "studio_public.html",
            studio=studio,
            photos=photos,
            hero_photo=hero_photo,
            about_photo=about_photo,
            categories=categories,
            booking_error=None,
            booking_success=False,
        )

    @app.route("/studio/<slug>/booking", methods=["POST"])
    def create_booking(slug):
        database = db_module.get_db()
        studio = database.execute("SELECT * FROM studios WHERE slug = ?", (slug,)).fetchone()
        if studio is None:
            abort(404)

        client_name = request.form.get("clientName", "").strip()
        client_email = request.form.get("clientEmail", "").strip()
        event_date = request.form.get("eventDate", "").strip()
        message = request.form.get("message", "").strip()

        error = None
        if len(client_name) < 2:
            error = "Please enter your name."
        elif not EMAIL_RE.match(client_email):
            error = "Please enter a valid email."
        elif not event_date:
            error = "Please choose a date."

        success = False
        if error is None:
            database.execute(
                """INSERT INTO bookings (id, studio_id, client_name, client_email, event_date, message)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (new_id(), studio["id"], client_name, client_email, event_date, message),
            )
            database.commit()
            success = True

        photos = database.execute(
            "SELECT * FROM photos WHERE studio_id = ? ORDER BY created_at DESC", (studio["id"],)
        ).fetchall()
        hero_photo = next((p for p in photos if p["role"] == "hero"), photos[0] if photos else None)
        about_photo = next(
            (p for p in photos if p["role"] == "about"),
            next((p for p in photos if not hero_photo or p["id"] != hero_photo["id"]), photos[0] if photos else None),
        )
        categories = sorted({p["category"] for p in photos if p["category"]})

        return render_template(
            "studio_public.html",
            studio=studio,
            photos=photos,
            hero_photo=hero_photo,
            about_photo=about_photo,
            categories=categories,
            booking_error=error,
            booking_success=success,
        )

    # ---- uploaded photo files ---------------------------------------------

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOADS_DIR"], filename)

    @app.before_request
    def _stash_uploads_dir():
        g.app_config_uploads_dir = app.config["UPLOADS_DIR"]

    def _unique_slug(database, base):
        root = slugify(base) or "studio"
        candidate = root
        n = 1
        while database.execute("SELECT 1 FROM studios WHERE slug = ?", (candidate,)).fetchone():
            n += 1
            candidate = f"{root}-{n}"
        return candidate


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
