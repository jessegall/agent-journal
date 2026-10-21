import threading

from journal.config import Config
from journal.db.connection import Connection
from journal.http.handler import Handler
from journal.http.support.identity import Identity
from journal.http.router import Router
from journal.http.static_files import StaticFiles
from journal.http.threading_server import ThreadingServer


class Server:
    """One process, one port; every request is answered on a thread of its own. The port it got is written where the hook script reads it."""

    def __init__(self, config: Config, router: Router, identity: Identity, static: StaticFiles, database: Connection) -> None:
        self.config, self.router, self.identity, self.static, self.database = config, router, identity, static, database
        self._bound: list[ThreadingServer] = []
        self._thread = threading.Thread(target=lambda: self._bound[0].serve_forever(), name="http", daemon=True)

    @property
    def port(self) -> int:
        return self._bound[0].server_address[1]

    def start(self) -> None:
        self._bound.append(self._build())
        self.config.home.mkdir(parents=True, exist_ok=True)
        self.config.port_file.write_text(str(self.port))
        self._thread.start()

    def serve(self) -> None:
        self.start()
        self._thread.join()

    def stop(self) -> None:
        if self._thread.is_alive():
            self._bound[0].shutdown()
        for bound in self._bound:
            bound.server_close()
        if self._bound:
            self.config.port_file.unlink(missing_ok=True)

    def _build(self) -> ThreadingServer:
        bound = type("BoundHandler", (Handler,), {"router": self.router, "identity": self.identity, "static": self.static, "database": self.database})
        return self._bind(bound)

    def _bind(self, handler: type[Handler]) -> ThreadingServer:
        ports = self.config.ports()
        for port in ports[:-1]:
            try:
                return ThreadingServer(("127.0.0.1", port), handler)
            except OSError:
                continue
        return ThreadingServer(("127.0.0.1", ports[-1]), handler)
