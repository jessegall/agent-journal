from core.base.change.logged_event import LoggedEvent
from core.base.driver.command_category import CommandCategory
from core.base.listener.commit_listener import CommitListener
from core.base.performance.performance_tools import PerformanceTools
from core.modules.processes.queries.process_query import ProcessQuery


class TestRunMarkerListener(CommitListener):
    """Keeps the file that says tests are running up to date as runs start and end, however they end, also lost."""

    name = "processes.test-run-marker"
    event = "process.*"

    def __init__(self, processes: ProcessQuery, tools: PerformanceTools) -> None:
        self.processes, self.tools = processes, tools

    def handle(self, event: LoggedEvent) -> None:
        self.tools.keep_tests_running(self.processes.running().filter(category=CommandCategory.TEST_RUN).exists())
