import json
import mimetypes
import sys
from base64 import b64decode
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, unquote

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from engine.package import data  # noqa: E402
from features.sharing.controller import LAYOUT_FILE  # noqa: E402
from features.sharing.page import PICTURES, Page, document, unshared  # noqa: E402
from features.sharing.preview import card, tags  # noqa: E402
from surfaces.color import identity  # noqa: E402
from resources.base import Refused  # noqa: E402

APP_DIR = data("web", "dist")
BODY_LIMIT = 8192
COMMENT_HEADER = "X-Shared-Comment"
APP_PAGE = "share.html"
PREVIEW = "preview.png"
APP_HEADERS = {"Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
                                          "font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}

HEADERS = {
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
}


class ShareHandler(BaseHTTPRequestHandler):
    shares = None
    server_version = "share"
    sys_version = ""

    def log_message(self, *args) -> None:
        return

    def do_HEAD(self) -> None:
        self.do_GET()

    def do_GET(self) -> None:
        parts = [unquote(p) for p in self.path.split("?", 1)[0].split("/") if p]
        if len(parts) < 2 or parts[0] != "s":
            return self.page(404, unshared())
        share = self.shares._by_token(parts[1])
        if share is None or not share.approved:
            return self.page(404, unshared())
        if share.completed or (share.expires and share.expires < time.time()):
            return self.page(410, unshared())
        if not self.shares._unlocked(share, self.password()):
            return self.send(401, b"", {"WWW-Authenticate": 'Basic realm="Shared page", charset="UTF-8"'})
        rest = parts[2:]
        if share.layout:
            if rest != [LAYOUT_FILE]:
                return self.page(404, unshared())
            self.shares._layout_opened(share)
            return self.send(200, json.dumps(share.layout).encode(), {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"})
        app = APP_DIR / APP_PAGE
        if not rest and app.is_file():
            if not self.path.split("?", 1)[0].endswith("/"):
                return self.send(301, b"", {"Location": f"/s/{share.token}/"})
            self.shares._count_view(share.n)
            html = app.read_text().replace("</head>", f"{self.preview(share)}</head>", 1)
            return self.send(200, html.encode(), {"Content-Type": "text/html; charset=utf-8", **APP_HEADERS})
        if rest == [PREVIEW]:
            return self.send(200, card(identity(self.shares.record.root)["color"]), {"Content-Type": "image/png", "Cache-Control": "max-age=3600"})
        if rest == ["data.json"]:
            body = json.dumps(self.shares._shared_data(share)).encode()
            return self.send(200, body, {"Content-Type": "application/json", **APP_HEADERS})
        if rest[:1] == ["assets"] and len(rest) == 2:
            return self.asset(rest[1])
        if not rest:
            self.shares._count_view(share.n)
            return self.shown(share, share.target)
        if rest[0] == "files" and len(rest) == 4:
            return self.file(share, f"{rest[1]}:{rest[2]}", rest[3])
        if len(rest) == 2:
            return self.shown(share, f"{rest[0]}:{rest[1]}")
        return self.page(404, unshared())

    def do_POST(self) -> None:
        parts = [unquote(p) for p in self.path.split("?", 1)[0].split("/") if p]
        if len(parts) != 3 or parts[0] != "s" or parts[2] != "comment":
            return self.refused()
        share = self.shares._by_token(parts[1])
        if share is None or not share.approved or share.completed or (share.expires and share.expires < time.time()):
            return self.page(404, unshared())
        if not self.shares._unlocked(share, self.password()):
            return self.send(401, b"", {"WWW-Authenticate": 'Basic realm="Shared page", charset="UTF-8"'})
        if self.headers.get(COMMENT_HEADER) != "1" or not self.headers.get("Content-Type", "").startswith("application/json"):
            return self.answer(403, "refused")
        size = int(self.headers.get("Content-Length") or 0)
        if not 0 < size <= BODY_LIMIT:
            return self.answer(413, "too large")
        try:
            given = json.loads(self.rfile.read(size))
            made = self.shares._visitor_comment(share, str(given["about"]), str(given["name"]), str(given["text"]))
        except (ValueError, KeyError, TypeError):
            return self.answer(400, "a comment needs about, name and text")
        except Refused as refused:
            return self.answer(422, str(refused))
        body = json.dumps({"n": made.n, "about": given["about"], "name": made.data["visitor"], "text": made.brief, "created": made.created}).encode()
        self.send(201, body, {"Content-Type": "application/json", **APP_HEADERS})

    def answer(self, code: int, text: str) -> None:
        self.send(code, json.dumps({"error": text}).encode(), {"Content-Type": "application/json", **APP_HEADERS})

    def password(self) -> str:
        given = self.headers.get("Authorization", "")
        if not given.startswith("Basic "):
            return ""
        try:
            return b64decode(given[6:]).decode().partition(":")[2]
        except (ValueError, UnicodeDecodeError):
            return ""

    def shown(self, share, ref: str) -> None:
        scope = self.shares._scope(share)
        if ref not in scope:
            return self.page(404, unshared())
        page = Page(share.token, scope)
        row = self.shares._shared_row(share, ref)
        members = [m for m in self.shares._members(share, row) if f"{m.type}:{m.n}" in scope]
        body = page.collection(row, members) if members else page.row(row)
        back = "" if ref == share.target else f"/s/{share.token}"
        self.page(200, document(row.title, body, share.expires, back))

    def preview(self, share) -> str:
        row = self.shares._shared_row(share, share.target)
        host = self.headers.get("Host", "")
        page = f"{'http' if host.startswith(('127.0.0.1', 'localhost')) else 'https'}://{host}/s/{share.token}"
        picture = next((name for name in row.files if Path(name).suffix.lower() in PICTURES), "")
        image = f"{page}/files/{row.type}/{row.n}/{quote(picture)}" if picture else f"{page}/{PREVIEW}"
        return tags(row.title, row.abstract or row.brief, image, f"{page}/", identity(self.shares.record.root)["project"])

    def file(self, share, ref: str, name: str) -> None:
        if ref not in self.shares._scope(share):
            return self.page(404, unshared())
        found = self.shares._shared_file(share, ref, name)
        if found is None:
            return self.page(404, unshared())
        kind = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
        inline = found.suffix.lower() in PICTURES
        headers = {"Content-Type": kind, "Content-Disposition": f"{'inline' if inline else 'attachment'}; filename*=UTF-8''{quote(found.name)}"}
        self.send(200, found.read_bytes(), headers)

    def asset(self, name: str) -> None:
        found = (APP_DIR / "assets" / name).resolve()
        if found.parent != (APP_DIR / "assets").resolve() or not found.is_file():
            return self.page(404, unshared())
        kind = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
        self.send(200, found.read_bytes(), {"Content-Type": kind, "Cache-Control": "public, max-age=31536000, immutable", **APP_HEADERS})

    def page(self, code: int, text: str) -> None:
        self.send(code, text.encode(), {"Content-Type": "text/html; charset=utf-8"})

    def send(self, code: int, body: bytes, headers: dict) -> None:
        self.send_response(code)
        for key, value in {**HEADERS, **headers, "Content-Length": str(len(body))}.items():
            self.send_header(key, value)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def refused(self) -> None:
        self.send(405, b"", {"Allow": "GET, HEAD, POST"})

    do_PUT = do_PATCH = do_DELETE = do_OPTIONS = refused


def serve(shares, port: int) -> None:
    handler = type("BoundShareHandler", (ShareHandler,), {"shares": shares})
    with ThreadingHTTPServer(("127.0.0.1", int(port)), handler) as server:
        server.serve_forever()


def main(argv: list[str]) -> None:
    import features
    from engine import runtime
    from engine.record import Record
    from features.sharing.controller import LAYOUT_FILE, Shares
    from resources.base import SYSTEM
    root = Path(argv[0])
    features.load(root)
    serve(Shares(Record(root, runtime.env(root)), actor=SYSTEM), int(argv[1]))


if __name__ == "__main__":
    main(sys.argv[1:])
