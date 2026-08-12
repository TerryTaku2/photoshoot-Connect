import functools
import re

import bcrypt
from flask import g, redirect, session, url_for

from db import get_db

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def create_session(user_id: str):
    session.clear()
    session["user_id"] = user_id
    session.permanent = True


def destroy_session():
    session.clear()


def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
        g.studio = None
        return

    db = get_db()
    g.user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    g.studio = db.execute("SELECT * FROM studios WHERE owner_id = ?", (user_id,)).fetchone()


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None or g.studio is None:
            return redirect(url_for("login"))
        return view(**kwargs)

    return wrapped_view


def init_app(app):
    app.before_request(load_logged_in_user)
