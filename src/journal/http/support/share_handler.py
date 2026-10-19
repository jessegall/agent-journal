import json
from ipaddress import ip_address, ip_network

from journal.http.support.pooled_handler import PooledHandler
from journal.http.support.share_answer import ShareAnswer
from journal.http.sharing.share_pages import SharePages
from journal.http.sharing.visitor_comment import VisitorComment

MOST_BYTES = 16 * 1024
HEADERS = {
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
}


class ShareHandler(PooledHandler):
    """One exchange with a visitor of a link: a read or a comment, answered by the share pages; every other method is refused."""

    pages: SharePages
    server_version = "share"
    sys_version = ""

    def log_message(self, format, *args) -> None:
        return None

    def do_GET(self) -> None:
        self.send(self.pages.get(self.path, self.headers.get("Authorization"), self.place()))

    def do_HEAD(self) -> None:
        self.do_GET()

    def do_POST(self) -> None:
        given = self.comment_sent()
        self.send(ShareAnswer(400) if given is None else self.pages.post(self.path, given, self.headers.get("Authorization"), self.place()))

    def comment_sent(self) -> VisitorComment | None:
        """A comment as the share page alone sends it: with its own header, which a form on another site cannot set, and a JSON body of a few kilobytes; none otherwise."""
        length = self.headers.get("Content-Length", "")
        size = int(length) if length.isdigit() else 0
        if self.headers.get("X-Shared-Comment") != "1" or not 0 < size <= MOST_BYTES:
            return None
        try:
            given = json.loads(self.rfile.read(size))
        except ValueError:
            return None
        return VisitorComment.from_payload(given) if isinstance(given, dict) else None

    def refused(self) -> None:
        self.send(ShareAnswer(405, headers={"Allow": "GET, HEAD, POST"}))

    do_PUT = do_PATCH = do_DELETE = do_OPTIONS = refused

    def place(self) -> str:
        """Where a visitor comes from: the address the tunnel forwarded for, else the peer's, an IPv6 one by its /64 network."""
        forwarded = self.headers.get("X-Forwarded-For", "").rsplit(",", 1)[-1].strip()
        try:
            address = ip_address(forwarded or self.client_address[0])
        except ValueError:
            address = ip_address(self.client_address[0])
        return str(ip_network(f"{address}/64", strict=False)) if address.version == 6 else str(address)

    def send(self, answer: ShareAnswer) -> None:
        self.send_response(answer.status)
        for name, value in {**HEADERS, "Content-Type": answer.kind, **answer.headers, "Content-Length": str(len(answer.body))}.items():
            self.send_header(name, value)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(answer.body)
