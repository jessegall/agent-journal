import threading
from http.server import ThreadingHTTPServer

from journal.config import Config
from journal.db.connection import Connection
from journal.http.handler import Handler
from journal.http.support.identity import Identity
from journal.http.router import Router
from journal.http.static_files import StaticFiles


class Server:
    """One process, one port; every request is answered on a thread of its own. The port it got is written where the hook script reads it."""

    def __init__(self, config: Config, router: Router, identity: Identity, static: StaticFiles, database: Connection) -> None:
        self.config, self.router, self.identity, self.static, self.database = config, router, identity, static, database
        self._server = self._build()
        self._thread = threading.Thread(target=lambda: self._server.serve_forever(poll_interval=0.05), name="http", daemon=True)

    @property
    def port(self) -> int:
        return self._server.server_address[1]

    def start(self) -> None:
        """Serves on a thread of its own until stop()."""
        self.config.home.mkdir(parents=True, exist_ok=True)
        self.config.port_file.write_text(str(self.port))
        self._thread.start()

    def serve(self) -> None:
        """Blocks until stop() is called."""
        self.start()
        self._thread.join()

    def stop(self) -> None:
        if self._thread.is_alive():
            self._server.shutdown()
        self._server.server_close()
        self.config.port_file.unlink(missing_ok=True)

    def _build(self) -> ThreadingHTTPServer:
        bound = type("BoundHandler", (Handler,), {"router": self.router, "identity": self.identity, "static": self.static, "database": self.database})
        server = self._bind(bound)
        server.daemon_threads = True
        return server

    def _bind(self, handler: type[Handler]) -> ThreadingHTTPServer:
        """Takes the first free port of the ones the config names; a taken one is left to whoever has it."""
        ports = self.config.ports()
        for port in ports[:-1]:
            try:
                return ThreadingHTTPServer(("127.0.0.1", port), handler)
            except OSError:
                continue
        return ThreadingHTTPServer(("127.0.0.1", ports[-1]), handler)
