from journal.config import Config
from journal.container import Container
from journal.console.console import Console
from journal.console.standard_commands import StandardCommands
from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.features.bus import Bus
from journal.http.router import Router
from journal.http.routes import Routes
from journal.http.server import Server
from journal.models.all_models import AllModels


class App:
    """Opens the database once and hands everything else its dependencies."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.container = Container()
        self.container.instance(Container, self.container)
        self.container.instance(Config, config)
        self.container.instance(Bus, Bus())
        self.container.bind(Connection, self.connection)
        self.container.bind(Router, lambda: Routes(self.container).mount(Router()))

    def connection(self) -> Connection:
        self.config.home.mkdir(parents=True, exist_ok=True)
        connection = Connection(self.config.database)
        Schema(connection, AllModels.MODELS).create()
        return connection

    def server(self) -> Server:
        return self.container.get(Server)

    def console(self) -> Console:
        console = self.container.get(Console)
        for command in StandardCommands.COMMANDS:
            console.add(command)
        return console
