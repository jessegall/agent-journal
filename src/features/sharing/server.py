import gzip
import json
import mimetypes
import sys
from base64 import b64decode
import threading
from dataclasses import asdict, dataclass, replace
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, unquote

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import commands.cli  # noqa: E402,F401
from engine.package import data  # noqa: E402
from features import running  # noqa: E402
from features.sharing.controller import HEALTH, HEALTH_MARKER, LAYOUT_FILE  # noqa: E402
from features.sharing.passwords import unlocked  # noqa: E402
from features.sharing.visiting import SharedComment  # noqa: E402
from features.sharing.page import PICTURES, Page, document, unshared  # noqa: E402
from features.format import SHARED, formatted
from features.sharing.preview import card, tags  # noqa: E402
from features.sharing.routes import ROUTES, TICKS  # noqa: E402
from controllers.faults import threw  # noqa: E402
from engine.color import identity  # noqa: E402
from resources.base import Refused  # noqa: E402

APP_DIR = data("web", "dist")
TICK_EVERY = 15
READ_SECONDS = 15
BODY_LIMIT = 8192
OPEN = 200
GONE_ON_POST = {410: 404}
PACKED_FROM = 1024
PACKED = ("text/", "application/javascript", "image/svg+xml")
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


def routed(parts: list[str], record):
    return ROUTES.keyed(record).get(parts[0]) if parts else None


@dataclass(frozen=True)
class VisitorComment:
    about: str
    name: str
    text: str

    @classmethod
    def from_payload(cls, given: dict) -> "VisitorComment":
        return cls(str(given["about"]), str(given["name"]), str(given["text"]))


@dataclass(frozen=True)
class VisitorAnswer:
    comment: int
    name: str
    choice: str

    @classmethod
    def from_payload(cls, given: dict) -> "VisitorAnswer":
        return cls(int(given["comment"]), str(given["name"]), str(given["choice"]))


def posted_comment(shares, share, given: dict) -> dict:
    sent = VisitorComment.from_payload(given)
    return asdict(SharedComment.of(shares._visitor_comment(share, sent.about, sent.name, sent.text), sent.about, shares._home(share)))


def posted_answer(shares, share, given: dict) -> dict:
    sent = VisitorAnswer.from_payload(given)
    return asdict(replace(sent, choice=shares._visitor_answer(share, sent.comment, sent.name, sent.choice).data["answer"]))


VISITOR_POSTS = {"comment": posted_comment, "answer": posted_answer}


class ShareHandler(BaseHTTPRequestHandler):
    shares = None
    server_version = "share"
    sys_version = ""

    def log_message(self, *args) -> None:
        return

    def sharing(self) -> bool:
        from features.sharing.feature import SharingFeature
        return running(SharingFeature).enabled(self.shares.record)

    def opened(self, token: str):
        share = self.shares._by_token(token)
        if share is None or not share.approved:
            return share, 404
        if share.ended:
            return share, 410
        if not unlocked(share, self.password()):
            return share, 401
        return share, OPEN

    def closed(self, code: int) -> None:
        if code == 401:
            return self.send(401, b"", {"WWW-Authenticate": 'Basic realm="Shared page", charset="UTF-8"'})
        return self.page(code, unshared())

    def do_HEAD(self) -> None:
        self.do_GET()

    def do_GET(self) -> None:
        parts = [unquote(p) for p in self.path.split("?", 1)[0].split("/") if p]
        if parts == [HEALTH]:
            return self.send(200, HEALTH_MARKER.encode(), {"Content-Type": "text/plain"})
        if (route := routed(parts, self.shares.record)) is not None:
            return route.get(self, parts[1:])
        if len(parts) < 2 or parts[0] != "s" or not self.sharing():
            return self.page(404, unshared())
        share, code = self.opened(parts[1])
        if code != OPEN:
            return self.closed(code)
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
        if (route := routed(parts, self.shares.record)) is not None:
            return route.post(self, parts[1:])
        if len(parts) != 3 or parts[0] != "s" or parts[2] not in VISITOR_POSTS or not self.sharing():
            return self.refused()
        share, code = self.opened(parts[1])
        if code != OPEN:
            return self.closed(GONE_ON_POST.get(code, code))
        if self.headers.get(COMMENT_HEADER) != "1" or not self.headers.get("Content-Type", "").startswith("application/json"):
            return self.answer(403, "refused")
        length = self.headers.get("Content-Length", "")
        size = int(length) if length.isdigit() else 0
        if not 0 < size <= BODY_LIMIT:
            return self.answer(413, "too large")
        try:
            given = json.loads(self.rfile.read(size))
            body = VISITOR_POSTS[parts[2]](self.shares, share, given)
        except (ValueError, KeyError, TypeError):
            return self.answer(400, "a comment needs about, name and text; an answer needs comment, name and choice")
        except Refused as refused:
            return self.answer(422, str(refused))
        self.send(201, json.dumps(body).encode(), {"Content-Type": "application/json", **APP_HEADERS})

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
        record = self.shares._home(share)
        page = Page(f"/s/{share.token}", scope, record)
        row = self.shares._shared_row(share, ref)
        members = [m for m in self.shares._members(share, row) if f"{m.type}:{m.n}" in scope]
        body = page.collection(row, members) if members else page.row(row)
        back = None if ref == share.target else f"/s/{share.token}"
        self.page(200, document(formatted(row.title, record, SHARED), body, share.expires, back))

    def preview(self, share) -> str:
        row = self.shares._shared_row(share, share.target)
        host = self.headers.get("Host", "")
        page = f"{'http' if host.startswith(('127.0.0.1', 'localhost')) else 'https'}://{host}/s/{share.token}"
        picture = next((name for name in row.files if Path(name).suffix.lower() in PICTURES), "")
        image = f"{page}/files/{row.type}/{row.n}/{quote(picture)}" if picture else f"{page}/{PREVIEW}"
        return tags(formatted(row.title, self.shares._home(share), SHARED), row.abstract or row.brief, image, f"{page}/", identity(self.shares.record.root)["project"])

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
        answer = self.packed if kind.startswith(PACKED) else self.send
        answer(200, found.read_bytes(), {"Content-Type": kind, "Cache-Control": "public, max-age=31536000, immutable", **APP_HEADERS})

    def packed(self, code: int, body: bytes, headers: dict) -> None:
        if "gzip" not in self.headers.get("Accept-Encoding", "") or len(body) < PACKED_FROM:
            return self.send(code, body, headers)
        self.send(code, gzip.compress(body, 6), {**headers, "Content-Encoding": "gzip", "Vary": "Accept-Encoding"})

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


def ticking(shares, stopped: threading.Event) -> None:
    while not stopped.wait(TICK_EVERY):
        for tick in TICKS.each(shares.record):
            try:
                tick(shares)
            except Exception:
                threw(shares.record.root, shares.record.env, f"a share server tick: {getattr(tick, '__name__', tick)}")


def serve(shares, port: int) -> None:
    stopped = threading.Event()
    threading.Thread(target=ticking, args=(shares, stopped), daemon=True).start()
    handler = type("BoundShareHandler", (ShareHandler,), {"shares": shares, "timeout": READ_SECONDS})
    try:
        with ThreadingHTTPServer(("127.0.0.1", int(port)), handler) as server:
            server.serve_forever()
    finally:
        stopped.set()


def main(argv: list[str]) -> None:
    import features
    from engine import runtime
    from engine.record import Record
    from features.sharing.controller import Shares
    from features.switches import watch_change_log
    from resources.base import SYSTEM
    root = Path(argv[0])
    features.load(root)
    watch_change_log()
    serve(Shares(Record(root, runtime.env(root)), actor=SYSTEM), int(argv[1]))


if __name__ == "__main__":
    main(sys.argv[1:])
