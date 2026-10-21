import json
from ipaddress import ip_address, ip_network

from journal.http.support.pooled_handler import PooledHandler
from journal.http.phone.phone_pages import PhonePages
from journal.http.phone.phone_request import PhoneRequest
from journal.http.support.share_answer import ShareAnswer
from journal.http.sharing.share_pages import SharePages
from journal.http.sharing.visitor_comment import VisitorComment

BODY_LIMIT_BYTES = 16 * 1024
HEADERS = {
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
}


class ShareHandler(PooledHandler):
    """One exchange through the tunnel: a link's read or comment, answered by the share pages, or the phone's, answered by the phone pages under /p/; every other method is refused."""

    pages: SharePages
    phone: PhonePages
    server_version = "share"
    sys_version = ""

    def log_message(self, format, *args) -> None:
        return None

    def do_GET(self) -> None:
        if self.is_phone():
            return self.send(self.phone.get(PhoneRequest.build(self.command, self.path, self.headers)))
        self.send(self.pages.get(self.path, self.headers.get("Authorization"), self.place()))

    def is_phone(self) -> bool:
        return self.path == "/p" or self.path.startswith(("/p/", "/p?"))

    def do_HEAD(self) -> None:
        self.do_GET()

    def do_POST(self) -> None:
        if self.is_phone():
            return self.send(self.phone_post())
        value = self.comment_sent()
        self.send(ShareAnswer(400) if value is None else self.pages.post(self.path, value, self.headers.get("Authorization"), self.place()))

    def phone_post(self) -> ShareAnswer:
        length = self.headers.get("Content-Length", "")
        size = int(length) if length.isdigit() else 0
        if size > BODY_LIMIT_BYTES:
            return ShareAnswer(413)
        return self.phone.post(PhoneRequest.build(self.command, self.path, self.headers, self.rfile.read(size) if size else b""))

    def comment_sent(self) -> VisitorComment | None:
        length = self.headers.get("Content-Length", "")
        size = int(length) if length.isdigit() else 0
        if self.headers.get("X-Shared-Comment") != "1" or not 0 < size <= BODY_LIMIT_BYTES:
            return None
        try:
            value = json.loads(self.rfile.read(size))
        except ValueError:
            return None
        return VisitorComment.parsed(value) if isinstance(value, dict) else None

    def refused(self) -> None:
        self.send(ShareAnswer(405, headers={"Allow": "GET, HEAD, POST"}))

    do_PUT = do_PATCH = do_DELETE = do_OPTIONS = refused

    def place(self) -> str:
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
