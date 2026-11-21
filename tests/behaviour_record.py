import json
import os
from pathlib import Path

from journal.engine.nudger import NUDGE
from journal.engine.support.stack_history import StackHistory
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from tests.stories.builder.journal_log import JournalLog

# set to a folder to have each process of a run of the old tests write, per test, the lines the journal told and the stack moves it made
BEHAVIOUR_RECORD_VARIABLE = "JOURNAL_BEHAVIOUR_RECORD"
# the newest entries read at a test's end, enough for any one test
ENTRIES_READ = 5000


class BehaviourRecord:
    """What each old test made the journal do, read from the main environment's entries newer than the test's start: the lines told by their key and the kinds of stack move, so a script can set them beside what the stories make the journal do."""

    def __init__(self) -> None:
        self.tests: dict[str, dict[str, list[str]]] = {}

    @staticmethod
    def is_asked() -> bool:
        return bool(os.environ.get(BEHAVIOUR_RECORD_VARIABLE))

    def started(self, app) -> int:
        return max((entry.row_id for entry in self.entries(app)), default=0)

    def read(self, nodeid: str, app, start: int) -> None:
        made = [entry for entry in self.entries(app) if entry.row_id > start]
        self.tests[nodeid] = {"lines": sorted({entry.data["key"] for entry in made if entry.entry_type == NUDGE}), "moves": sorted({JournalLog.step(entry) for entry in made if entry.entry_type == StackHistory.KIND})}

    @staticmethod
    def entries(app) -> list:
        with app.container.get(Scope).environment(app.container.get(Environments).lookup("main").id):
            return [entry for entry in app.container.get(Entries).kind_entries_scoped(ENTRIES_READ) if entry.entry_type in (NUDGE, StackHistory.KIND)]

    def saved(self) -> None:
        folder = Path(os.environ[BEHAVIOUR_RECORD_VARIABLE])
        folder.mkdir(parents=True, exist_ok=True)
        (folder / f"tests-{os.getpid()}.json").write_text(json.dumps(self.tests))
