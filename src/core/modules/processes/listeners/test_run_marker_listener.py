from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.change.logged_event import LoggedEvent
from engine.driver.command_category import CommandCategory
from engine.listener.commit_listener import CommitListener
from engine.database.kept_rows import KeptRows
from engine.module.performance_tools import PerformanceTools
from core.modules.processes.queries.process_query import OPEN, ProcessQuery
from core.modules.processes.models.process import Process


class TestRunMarkerListener(CommitListener[Changed[Process]]):
    """Keeps the file that says tests are running up to date as runs start and end, however they end, also lost."""

    name = "processes.test-run-marker"

    def __init__(self, processes: ProcessQuery, tools: PerformanceTools, kept: KeptRows) -> None:
        self.processes, self.tools = processes, tools
        self.kept = kept

    def handle(self, event: Changed[Process], logged: LoggedEvent) -> None:
        process = event.row
        is_running_test = not isinstance(event, Deleted) and process.state in OPEN and process.category is CommandCategory.TEST_RUN
        active_ids = {process.id} if is_running_test else set[int]()

        def updated(ids: set[int]) -> set[int]:
            return (ids - {process.id}) | active_ids

        self.kept.update("processes", updated,
                         "state IN (?, ?) AND category = ?", [*OPEN, CommandCategory.TEST_RUN], name="processes.running_tests")
        running = self.kept.read("processes", lambda: {row.id for row in self.processes.running().filter(category=CommandCategory.TEST_RUN).all_rows()},
                                 "state IN (?, ?) AND category = ?", [*OPEN, CommandCategory.TEST_RUN], name="processes.running_tests")
        self.tools.keep_tests_running(bool(running))
