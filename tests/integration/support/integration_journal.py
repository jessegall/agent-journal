import io
import json
import shlex
from dataclasses import dataclass
from uuid import uuid4

from core.modules import DEFAULT_MODULES
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from engine.file.file_access import FileAccess
from engine.container.container import Container
from engine.database.database import Database
from engine.database.repeated_work import RepeatedWork
from engine.driver.hook_event import HookEvent
from engine.driver.hook_reply import HookReply
from engine.driver.hook_route import HookRoute
from engine.journal.journal_home import JournalHome
from engine.module.journal_container import synced_database_container
from engine.registry.registry import Registry
from engine.testing.examples.hook_sample import HookSample
from engine.testing.examples.hook_samples import SAMPLE_FIRING
from engine.time.clock import Clock

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
        self.database.repeated_work = RepeatedWork(self.database)
        self.container: Container = synced_database_container(home, self.database)

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = MAIN_ENVIRONMENT) -> LineAnswer:
        stream = io.StringIO()
        code = self.container.get(Console).run(shlex.split(line), Caller(actor or Actor.core(), environment_id), stream)
        return LineAnswer(code, stream.getvalue())

    # the agent program of the session fires the sample hook, answered through the real hook route
    def hook(self, session: str, sample: HookSample) -> HookReply:
        fired_at_ms = int(self.container.get(Clock).timestamp().value.timestamp() * 1000)
        firing = f"integration-{uuid4().hex}" if sample.firing == SAMPLE_FIRING else sample.firing
        event = HookEvent.parsed(sample.with_fields(session=session, firing=firing, fired_at_ms=fired_at_ms).body)
        return self.container.get(HookRoute).answer(event)

    # lines run from now on read this clock, as a test that needs rows written at one moment asks
    def with_clock(self, clock: Clock) -> None:
        self.container = synced_database_container(self.home, self.database)
        self.container.bind(Clock, clock)

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
        return self.synced()

    # the journal syncs its module list again, as an install does; a passed sync reopens the container
    def synced(self) -> LineAnswer:
        stream = io.StringIO()
        code = self.container.get(ModuleSyncLine).run(list(SYNC_ARGV), stream)
        if code == 0:
            self.database.close()
            self.database = Database.opened(self.home)
            self.database.repeated_work = RepeatedWork(self.database)
            self.container = synced_database_container(self.home, self.database)
        return LineAnswer(code, stream.getvalue())

    # a sync with the module is refused with the text, and the registry stays as it was
    def expect_sync_refusal(self, module: str, text: str) -> None:
        registry_text = Registry.read(self.database).entries_text()
        answer = self.synced_with(module)
        assert answer.code != 0 and text in answer.text, f"module sync with {module} gave {answer.code}: {answer.text}"
        assert Registry.read(self.database).entries_text() == registry_text, "a refused sync changed the registry"

    def expect_sync_success(self, module: str) -> None:
        answer = self.synced_with(module)
        assert answer.code == 0, f"module sync with {module} gave {answer.code}: {answer.text}"

    def close(self) -> None:
        self.database.close()


# a journal from journal_with that has the main environment, as the journal fixture does
def main_journal(journal_with, *modules: str) -> IntegrationJournal:
    journal = journal_with(*modules)
    answer = journal.run("environment make main /work/journal", environment_id=None)
    assert answer.code == 0, answer.text
    return journal
