from core.base.container import Container
from core.base.dotted_path.dotted_path import DottedPath
from core.base.registry.registry import Registry
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.tasks.support.task_assigner import TaskAssigner


class SuiteTaskAssigners:
    """The task assigner of the suite an environment runs, or of the nearest suite it requires; a suite with none
    hands out nothing."""

    def __init__(self, suites: SuiteChoice, registry: Registry, container: Container) -> None:
        self.suites, self.registry, self.container = suites, registry, container

    def assigner(self) -> TaskAssigner | None:
        running = self.suites.suite()
        names = self.registry.ancestors(running) if running is not None else ()
        entries = (self.registry.suite(name) for name in names)
        paths = [entry.task_assigner for entry in entries if entry is not None and entry.task_assigner]
        return self.container.get(DottedPath(paths[0]).checked_class(TaskAssigner)) if paths else None
