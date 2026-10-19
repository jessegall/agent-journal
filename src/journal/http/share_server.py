import threading
from http.server import ThreadingHTTPServer

from journal.db.connection import Connection
from journal.features.sharing.share_place import SharePlace
from journal.http.support.share_handler import ShareHandler
from journal.http.sharing.share_pages import SharePages

READ_SECONDS = 15


class ShareServer:
    """The listener the tunnel forwards to, on this machine alone: it answers links and nothing else of the journal. Its port is kept, so the tunnel finds it again after a restart."""

    def __init__(self, pages: SharePages, place: SharePlace, database: Connection) -> None:
        self.place = place
        self.handler = type("BoundShareHandler", (ShareHandler,), {"pages": pages, "database": database, "timeout": READ_SECONDS})
        self._server: ThreadingHTTPServer | None = None

    @property
    def port(self) -> int:
        """The port it listens on, as it kept it when it started."""
        return self.place.kept().port

    def start(self) -> None:
        """Listens on the port it had before, or any free one when that is taken, and keeps the one it got."""
        self._server = self._bind(self.place.kept().port)
        self._server.daemon_threads = True
        self.place.keep(port=self._server.server_address[1])
        threading.Thread(target=lambda: self._server.serve_forever(poll_interval=0.2), name="share", daemon=True).start()

    def stop(self) -> None:
        if self._server:
            self._server.shutdown()
            self._server.server_close()

    def _bind(self, kept: int) -> ThreadingHTTPServer:
        if kept:
            try:
                return ThreadingHTTPServer(("127.0.0.1", kept), self.handler)
            except OSError:
                pass
        return ThreadingHTTPServer(("127.0.0.1", 0), self.handler)
