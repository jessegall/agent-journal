from ipaddress import ip_address, ip_network

from journal.http.pooled_handler import PooledHandler
from journal.http.share_answer import ShareAnswer
from journal.http.v3.share_pages import SharePages

HEADERS = {
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
}


class ShareHandler(PooledHandler):
    """One exchange with a visitor of a link: a read, answered by the share pages; every other method is refused."""

    pages: SharePages
    server_version = "share"
    sys_version = ""

    def log_message(self, format, *args) -> None:
        return None

    def do_GET(self) -> None:
        self.send(self.pages.get(self.path, self.headers.get("Authorization"), self.place()))

    def do_HEAD(self) -> None:
        self.do_GET()

    def refused(self) -> None:
        self.send(ShareAnswer(405, headers={"Allow": "GET, HEAD"}))

    do_POST = do_PUT = do_PATCH = do_DELETE = do_OPTIONS = refused

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
