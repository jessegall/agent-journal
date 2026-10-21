import threading

from journal.db.connection import Connection
from journal.features.sharing.support.share_place import SharePlace
from journal.http.phone.phone_pages import PhonePages
from journal.http.share_handler import ShareHandler
from journal.http.sharing.share_pages import SharePages
from journal.http.threading_server import ThreadingServer

READ_SECONDS = 15


class ShareServer:
    """The listener the tunnel forwards to, on this machine alone: it answers links and the paired phone, and nothing else of the journal. Its port is kept, so the tunnel finds it again after a restart."""

    def __init__(self, pages: SharePages, phone: PhonePages, place: SharePlace, database: Connection) -> None:
        self.place = place
        self.handler = type("BoundShareHandler", (ShareHandler,), {"pages": pages, "phone": phone, "database": database, "timeout": READ_SECONDS})
        self._server: ThreadingServer | None = None

    @property
    def port(self) -> int:
        return self.place.stored().port

    def start(self) -> None:
        self._server = self._bind(self.place.stored().port)
        self.place.store(port=self._server.server_address[1])
        threading.Thread(target=self._server.serve_forever, name="share", daemon=True).start()

    def stop(self) -> None:
        if self._server:
            self._server.shutdown()
            self._server.server_close()

    def _bind(self, stored: int) -> ThreadingServer:
        if stored:
            try:
                return ThreadingServer(("127.0.0.1", stored), self.handler)
            except OSError:
                pass
        return ThreadingServer(("127.0.0.1", 0), self.handler)
