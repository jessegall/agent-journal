from core.base.change.logged_event import LoggedEvent
from core.base.driver.command_category import CommandCategory
from core.base.listener.commit_listener import CommitListener
from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.module.performance_tools import PerformanceTools
from core.modules.processes.queries.process_query import OPEN, ProcessQuery
from core.base.change.touched import Touched
from core.modules.processes.models.process import Process


class TestRunMarkerListener(CommitListener[Touched[Process]]):
    """Keeps the file that says tests are running up to date as runs start and end, however they end, also lost."""

    name = "processes.test-run-marker"

    def __init__(self, processes: ProcessQuery, tools: PerformanceTools, kept: KeptRows, rows: EventRows) -> None:
        self.processes, self.tools = processes, tools
        self.kept = kept
        self.rows = rows

    def handle(self, event: Touched[Process], logged: LoggedEvent) -> None:
        process = self.rows.find(Process, logged.row_id)
        active_ids = {process.id} if process is not None and process.state in OPEN and process.category is CommandCategory.TEST_RUN else set()
        self.kept.update("processes", lambda ids: (ids - {logged.row_id}) | active_ids,
                         "state IN (?, ?) AND category = ?", [*OPEN, CommandCategory.TEST_RUN], name="processes.running_tests")
        running = self.kept.read("processes", lambda: {row.id for row in self.processes.running().filter(category=CommandCategory.TEST_RUN).all_rows()},
                                 "state IN (?, ?) AND category = ?", [*OPEN, CommandCategory.TEST_RUN], name="processes.running_tests")
        self.tools.keep_tests_running(bool(running))
