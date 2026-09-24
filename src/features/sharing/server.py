import mimetypes
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, unquote

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from features.sharing.page import PICTURES, Page, document, ended, missing  # noqa: E402

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
            return self.page(404, missing())
        share = self.shares._by_token(parts[1])
        if share is None:
            return self.page(404, missing())
        if share.completed or (share.expires and share.expires < time.time()):
            return self.page(410, ended())
        rest = parts[2:]
        if not rest:
            self.shares._count_view(share.n)
            return self.shown(share, share.target)
        if rest[0] == "files" and len(rest) == 4:
            return self.file(share, f"{rest[1]}:{rest[2]}", rest[3])
        if len(rest) == 2:
            return self.shown(share, f"{rest[0]}:{rest[1]}")
        return self.page(404, missing())

    def shown(self, share, ref: str) -> None:
        scope = self.shares._scope(share)
        if ref not in scope:
            return self.page(404, missing())
        page = Page(share.token, scope)
        row = self.shares._shared_row(share, ref)
        members = [m for m in self.shares._members(share, row) if f"{m.type}:{m.n}" in scope] if row.type == "collection" else []
        body = page.collection(row, members) if row.type == "collection" else page.row(row)
        back = "" if ref == share.target else f"/s/{share.token}"
        self.page(200, document(row.title, body, share.expires, back))

    def file(self, share, ref: str, name: str) -> None:
        if ref not in self.shares._scope(share):
            return self.page(404, missing())
        found = self.shares._shared_file(share, ref, name)
        if found is None:
            return self.page(404, missing())
        kind = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
        inline = found.suffix.lower() in PICTURES
        headers = {"Content-Type": kind, "Content-Disposition": f"{'inline' if inline else 'attachment'}; filename*=UTF-8''{quote(found.name)}"}
        self.send(200, found.read_bytes(), headers)

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
        self.send(405, b"", {"Allow": "GET, HEAD"})

    do_POST = do_PUT = do_PATCH = do_DELETE = do_OPTIONS = refused


def serve(shares, port: int) -> None:
    handler = type("BoundShareHandler", (ShareHandler,), {"shares": shares})
    with ThreadingHTTPServer(("127.0.0.1", int(port)), handler) as server:
        server.serve_forever()


def main(argv: list[str]) -> None:
    import features
    from engine import runtime
    from engine.record import Record
    from features.sharing.controller import Shares
    from resources.base import SYSTEM
    root = Path(argv[0])
    features.load(root)
    serve(Shares(Record(root, runtime.env(root)), actor=SYSTEM), int(argv[1]))


if __name__ == "__main__":
    main(sys.argv[1:])
