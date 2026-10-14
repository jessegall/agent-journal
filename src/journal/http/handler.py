from http.server import BaseHTTPRequestHandler

from journal.http.request import Request
from journal.http.response import Response
from journal.http.router import Router


class Handler(BaseHTTPRequestHandler):
    """Turns one HTTP exchange into a Request for the router and writes its Response back; nothing else lives here."""

    router: Router

    def do_GET(self) -> None: ...

    def do_POST(self) -> None: ...

    def _request(self) -> Request: ...

    def _reply(self, response: Response) -> None: ...
