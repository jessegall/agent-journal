import threading
from http.server import ThreadingHTTPServer

from journal.config import Config
from journal.http.handler import Handler
from journal.http.identity import Identity
from journal.http.router import Router


class Server:
    """One process, one port; every request is answered on a thread of its own. The port it got is written where the hook script reads it."""

    def __init__(self, config: Config, router: Router, identity: Identity) -> None:
        self.config, self.router, self.identity = config, router, identity
        self._server: ThreadingHTTPServer | None = None
        self._thread: threading.Thread | None = None

    @property
    def port(self) -> int:
        return self._server.server_address[1]

    def start(self) -> None:
        """Serves on a thread of its own until stop()."""
        self._server = self._build()
        self.config.home.mkdir(parents=True, exist_ok=True)
        self.config.port_file.write_text(str(self.port))
        self._thread = threading.Thread(target=lambda: self._server.serve_forever(poll_interval=0.05), name="http", daemon=True)
        self._thread.start()

    def serve(self) -> None:
        """Blocks until stop() is called."""
        self.start()
        self._thread.join()

    def stop(self) -> None:
        if self._server:
            self._server.shutdown()
            self._server.server_close()
            self.config.port_file.unlink(missing_ok=True)

    def _build(self) -> ThreadingHTTPServer:
        bound = type("BoundHandler", (Handler,), {"router": self.router, "identity": self.identity})
        server = ThreadingHTTPServer(("127.0.0.1", self.config.port), bound)
        server.daemon_threads = True
        return server
