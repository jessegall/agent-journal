from journal.config import Config
from journal.container import Container
from journal.console.console import Console
from journal.console.standard_commands import StandardCommands
from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.features.bus import Bus
from journal.engine.runtime import Runtime
from journal.features.registry import Registry
from journal.features.standard import Standard
from journal.hooks.context_file import ContextFile
from journal.repositories.settings import Settings
from journal.http.router import Router
from journal.http.routes import Routes
from journal.http.server import Server
from journal.http.static_files import StaticFiles
from pathlib import Path
from journal.models.all_models import AllModels


class App:
    """Opens the database once and hands everything else its dependencies."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.container = Container()
        self.container.instance(Container, self.container)
        self.container.instance(Config, config)
        self.container.instance(Bus, Bus())
        self.container.bind(ContextFile, lambda: ContextFile(config.status_home))
        self.container.bind(Connection, self.connection)
        self.container.bind(Router, lambda: Routes(self.container).mount(Router()))
        self.container.bind(Console, self._console)
        self.container.bind(StaticFiles, lambda: StaticFiles(Path(__file__).resolve().parents[1] / "web" / "dist"))
        self.container.bind(Registry, lambda: Registry(Standard.FEATURES, self.container.get(Settings)))

    def connection(self) -> Connection:
        self.config.home.mkdir(parents=True, exist_ok=True)
        connection = Connection(self.config.database)
        Schema(connection, AllModels.MODELS).create()
        return connection

    def server(self) -> Server:
        return self.container.get(Server)

    def console(self) -> Console:
        return self.container.get(Console)

    def _console(self) -> Console:
        console = Console(self.container)
        for command in StandardCommands.COMMANDS:
            console.add(command)
        for feature in self.container.get(Registry).features:
            for command in feature.commands:
                console.add(command)
        return console

    def runtime(self) -> Runtime:
        return self.container.get(Runtime)
