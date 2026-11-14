import io
import json
import shlex
from dataclasses import dataclass

from core.modules import DEFAULT_MODULES
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from engine.file.file_access import FileAccess
from engine.container.container import Container
from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from engine.module.journal_container import synced_database_container

MAIN_ENVIRONMENT = 1


@dataclass(frozen=True)
class LineAnswer:
    code: int
    text: str


class IntegrationJournal:
    """A journal on a synced home that an integration test drives through its real console and database: the
    machinery runs as it does in the server, with no story kit around it."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.database = Database.opened(home)
        self.container: Container = synced_database_container(home, self.database)

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = MAIN_ENVIRONMENT) -> LineAnswer:
        stream = io.StringIO()
        code = self.container.get(Console).run(shlex.split(line), Caller(actor or Actor.core(), environment_id), stream)
        return LineAnswer(code, stream.getvalue())

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        answer = self.run(f"{line} --json", actor)
        assert answer.code == 0, f"{line} gave {answer.code}: {answer.text}"
        return int(json.loads(answer.text.splitlines()[0])["id"])

    def make_user(self, name: str = "Ada") -> Actor:
        return Actor(self.new_row_id(f'actor make user "{name}"'), ActorType.USER)

    # runs a module's tick handler by its name, as the server's ticker would
    def run_tick(self, name: str) -> None:
        handler = next(handler for module in DEFAULT_MODULES for handler in module.tick_handlers if handler.label == name)
        handler.handler(self.container)

    # the module list gains the module and the journal syncs, as an install does; a passed sync reopens the container
    def synced_with(self, module: str) -> LineAnswer:
        modules = json.loads(FileAccess.read(self.home.module_list))
        FileAccess.write(self.home.module_list, json.dumps([*modules, module]))
        stream = io.StringIO()
        code = self.container.get(ModuleSyncLine).run(list(SYNC_ARGV), stream)
        if code == 0:
            self.database.close()
            self.database = Database.opened(self.home)
            self.container = synced_database_container(self.home, self.database)
        return LineAnswer(code, stream.getvalue())

    def close(self) -> None:
        self.database.close()
