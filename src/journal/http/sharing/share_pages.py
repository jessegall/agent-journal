import base64
import json
import mimetypes
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote

from journal.features.registry import Registry
from journal.features.sharing.feature import Sharing
from journal.features.sharing.support.share_password import SharePassword
from journal.features.sharing.support.tunnel import HEALTH, MARKER
from journal.features.sharing.support.wrong_passwords import WrongPasswords
from journal.http.support.json_out import JsonOut
from journal.http.support.share_answer import ShareAnswer
from journal.features.sharing.shared_comments import SharedComments
from journal.http.sharing.shared_data import SharedData
from journal.http.sharing.visitor_comment import VisitorComment
from journal.support.actor import Actor
from journal.models.share import Share
from journal.support.refused import Refused
from journal.support.scope import Scope
from journal.repositories.shares import Shares

APP = Path(__file__).resolve().parents[3] / "web" / "dist"
APP_PAGE = "share.html"
APP_HEADERS = {"Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
                                          "font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}
GONE = ("<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width'><title>Not shared</title>"
        "<p style='font:15px system-ui;margin:20vh auto;max-width:28em;text-align:center'>This link doesn't open anything. It may have ended, or the address is not complete.</p>")


class SharePages:
    """What the share server answers: its health, and a link's page, the page's data, its files and a visitor's comment. A link that is unknown, waiting, stopped or ended opens nothing."""

    def __init__(self, shares: Shares, data: SharedData, comments: SharedComments, registry: Registry, scope: Scope, wrong: WrongPasswords) -> None:
        self.shares, self.data, self.comments, self.registry, self.scope, self.wrong = shares, data, comments, registry, scope, wrong
        self._unlocked: dict[int, str] = {}

    def get(self, path: str, authorization: str | None, place: str) -> ShareAnswer:
        address = path.split("?", 1)[0]
        parts = self.parts(path)
        if parts == [HEALTH]:
            return ShareAnswer(200, MARKER.encode(), "text/plain")
        shut = self.shut(parts, authorization, place)
        if shut:
            return shut
        share, rest = self.shares.by_token(parts[1]), parts[2:]
        if not rest:
            return self.page(share, address)
        if rest == ["data.json"]:
            return ShareAnswer(200, json.dumps(self.data.of(share), cls=JsonOut).encode(), "application/json", APP_HEADERS)
        if rest[0] == "assets" and len(rest) == 2:
            return self.asset(rest[1])
        return self.gone(404)

    def post(self, path: str, comment: VisitorComment, authorization: str | None, place: str) -> ShareAnswer:
        """A visitor's comment, the one thing a link takes."""
        parts = self.parts(path)
        shut = self.shut(parts, authorization, place)
        if shut:
            return shut
        if parts[2:] != ["comment"]:
            return self.gone(404)
        try:
            comment = self.comments.leave(self.shares.by_token(parts[1]), comment.on, comment.name, comment.text)
        except Refused as refused:
            return ShareAnswer(409, json.dumps({"error": str(refused)}).encode(), "application/json")
        return ShareAnswer(201, json.dumps(comment, cls=JsonOut).encode(), "application/json")

    @staticmethod
    def parts(path: str) -> list[str]:
        return [unquote(part) for part in path.split("?", 1)[0].split("/") if part]

    def shut(self, parts: list[str], authorization: str | None, place: str) -> ShareAnswer | None:
        """What keeps a link from opening: unknown, waiting, switched off, stopped or ended, or locked by its password; nothing when it opens."""
        if len(parts) < 2 or parts[0] != "s":
            return self.gone(404)
        share = self.shares.by_token(parts[1])
        if share is None or not share.approved or not self.sharing_on(share):
            return self.gone(404)
        if not share.is_live(datetime.now(timezone.utc)):
            return self.gone(410)
        return self.locked(share, self.password(authorization), place)

    def sharing_on(self, share: Share) -> bool:
        with self.scope.of(share.environment_id):
            return self.registry.is_on(Sharing)

    def locked(self, share: Share, given: str | None, place: str) -> ShareAnswer | None:
        """The answer that keeps a password-locked link shut: asked for its password, or held a while after too many wrong ones."""
        if not share.password:
            return None
        if self.wrong.locked(place):
            return self.gone(429)
        if given is not None and self.unlocks(share, given):
            return None
        if given is not None:
            self.wrong.count(place)
        return ShareAnswer(401, headers={"WWW-Authenticate": 'Basic realm="Shared page", charset="UTF-8"'})

    def unlocks(self, share: Share, given: str) -> bool:
        """Whether the password opens the link; one that did is remembered, so the page's every file is not hashed again."""
        if self._unlocked.get(share.id) == given:
            return True
        if not SharePassword.matches(given, share.password):
            return False
        self._unlocked[share.id] = given
        return True

    @staticmethod
    def password(authorization: str | None) -> str | None:
        """The password a browser sends after asking the visitor; none when it sent none, or nothing readable."""
        if authorization is None or not authorization.startswith("Basic "):
            return None
        try:
            return base64.b64decode(authorization[6:]).decode().partition(":")[2]
        except (ValueError, UnicodeDecodeError):
            return None

    def page(self, share: Share, address: str) -> ShareAnswer:
        """The share app, counted as a view; its address ends in a slash, so the page's files are found beside it."""
        if not address.endswith("/"):
            return ShareAnswer(301, headers={"Location": f"/s/{share.token}/"})
        app = APP / APP_PAGE
        if not app.is_file():
            return self.gone(404)
        self.shares.save(share.viewed(), Actor.system())
        return ShareAnswer(200, app.read_bytes(), headers=APP_HEADERS)

    @staticmethod
    def asset(name: str) -> ShareAnswer:
        found = (APP / "assets" / name).resolve()
        if found.parent != (APP / "assets").resolve() or not found.is_file():
            return SharePages.gone(404)
        kind = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
        return ShareAnswer(200, found.read_bytes(), kind, {"Cache-Control": "public, max-age=31536000, immutable", **APP_HEADERS})

    @staticmethod
    def gone(status: int) -> ShareAnswer:
        return ShareAnswer(status, GONE.encode())
