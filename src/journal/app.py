from journal.config import Config
from journal.container import Container
from journal.db.connection import Connection
from journal.http.server import Server
from journal.console.console import Console


class App:
    """Opens the database once and hands everything else its dependencies."""

    def __init__(self, config: Config) -> None: ...

    @property
    def container(self) -> Container: ...

    def connection(self) -> Connection: ...

    def server(self) -> Server: ...

    def console(self) -> Console: ...
