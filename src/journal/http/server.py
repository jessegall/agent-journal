from http.server import ThreadingHTTPServer

from journal.config import Config
from journal.http.handler import Handler
from journal.http.router import Router


class Server:
    """One process, one port; every request is answered on a thread of its own."""

    def __init__(self, config: Config, router: Router) -> None: ...

    def serve(self) -> None:
        """Blocks until stop() is called."""
        ...

    def stop(self) -> None: ...

    def _build(self) -> ThreadingHTTPServer: ...
