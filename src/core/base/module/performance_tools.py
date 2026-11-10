from engine.container.container import Container
from engine.database.performance_costs import PerformanceCosts
from engine.database.points import Points
from engine.journal.journal_home import JournalHome
from core.base.module.module_finder import ModuleFinder
from engine.performance.performance_tool import PerformanceTool
from engine.performance.performance_state import PerformanceState, TESTS_RUNNING_FILE


class PerformanceTools:
    """Captures database costs and runs registered tools only outside lifecycle work and tests."""

    def __init__(self, finder: ModuleFinder, container: Container, home: JournalHome) -> None:
        self.registered = {tool for module in finder.modules() for tool in module.performance_tools}
        self.container = container
        self.marker = home.system_log.parent / TESTS_RUNNING_FILE
        self.state = container.get(PerformanceState)
        self.costs = container.get(PerformanceCosts)

    def run(self, tool: type[PerformanceTool], *values: object) -> object:
        if tool not in self.registered:
            raise ValueError(f"no module registers the performance tool {tool.name}")
        return self.container.get(tool).measure(*values) if self.state.can_measure else None

    def begin(self) -> Points | None:
        return self.costs.begin()

    def cost(self, start_points: Points | None) -> Points | None:
        return self.costs.cost(start_points)

    def keep_tests_running(self, is_running: bool) -> None:
        self.state.keep_tests_running(is_running)
