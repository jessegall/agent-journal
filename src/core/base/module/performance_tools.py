from core.base.container import Container
from core.base.journal_home import JournalHome
from core.base.module.module_finder import ModuleFinder
from core.base.performance.performance_tool import PerformanceTool

TESTS_RUNNING_FILE = "tests-running"


class PerformanceTools:
    """The one way to run a performance tool: only a tool a module registers runs, and none runs while the file that
    says tests are running is there, as a loaded machine would set them off for nothing."""

    def __init__(self, finder: ModuleFinder, container: Container, home: JournalHome) -> None:
        self.registered = {tool for module in finder.modules() for tool in module.performance_tools}
        self.container = container
        self.marker = home.costly_hooks_log.parent / TESTS_RUNNING_FILE

    def run(self, tool: type[PerformanceTool], *values: object) -> object:
        if tool not in self.registered:
            raise ValueError(f"no module registers the performance tool {tool.name}")
        return None if self.marker.exists() else self.container.get(tool).measure(*values)

    def keep_tests_running(self, is_running: bool) -> None:
        if not is_running:
            self.marker.unlink(missing_ok=True)
            return
        self.marker.parent.mkdir(parents=True, exist_ok=True)
        self.marker.touch()
