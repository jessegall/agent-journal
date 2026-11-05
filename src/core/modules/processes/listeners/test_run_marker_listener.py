from core.base.change.logged_event import LoggedEvent
from core.base.driver.command_category import CommandCategory
from core.base.listener.commit_listener import CommitListener
from core.base.module.performance_tools import PerformanceTools
from core.modules.processes.queries.process_query import ProcessQuery
from core.base.change.touched import Touched
from core.modules.processes.models.process import Process


class TestRunMarkerListener(CommitListener[Touched[Process]]):
    """Keeps the file that says tests are running up to date as runs start and end, however they end, also lost."""

    name = "processes.test-run-marker"

    def __init__(self, processes: ProcessQuery, tools: PerformanceTools) -> None:
        self.processes, self.tools = processes, tools

    def handle(self, event: Touched[Process], logged: LoggedEvent) -> None:
        self.tools.keep_tests_running(self.processes.running().filter(category=CommandCategory.TEST_RUN).exists())
