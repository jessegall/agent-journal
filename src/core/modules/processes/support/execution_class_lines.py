from core.modules.processes.support.installed_plugins import InstalledPlugins
from engine.execution.classes.builtin_classes import BUILTIN_CLASSES
from engine.execution.classes.execution_class import UNLIMITED, ExecutionClass
from engine.query.queries import Queries
from core.modules.processes.models.execution_class_row import ExecutionClassRow
from core.modules.processes.support.stored_execution_classes import STORED_CLASSES_REASON

ROW_LINE = "{name}: {lane} lane, cost {cost}, {priority}, {limit}{holds} ({origin})"


class ExecutionClassLines:
    """The class table as lines a person reads: every built-in class as it stands, changed or default, then each
    class of the person's own; a class of a plugin that is not installed is hidden until the plugin is back."""

    def __init__(self, queries: Queries, plugins: InstalledPlugins) -> None:
        self.queries, self.plugins = queries, plugins

    def lines(self) -> list[str]:
        stored = {row.name: row for row in self.queries.query(ExecutionClassRow).every_row(STORED_CLASSES_REASON)}
        built_in = [self.line(stored[row.execution_class.name].execution_class if row.execution_class.name in stored else row.execution_class,
                              "changed" if row.execution_class.name in stored else "built-in") for row in BUILTIN_CLASSES]
        own = [self.line(row.execution_class, "your own") for name, row in stored.items()
               if not row.is_override and (not row.execution_class.plugin or self.plugins.is_installed(row.execution_class.plugin))]
        return [*built_in, *own]

    @staticmethod
    def line(execution_class: ExecutionClass, origin: str) -> str:
        holds = f", holds {execution_class.line_pattern}" if execution_class.line_pattern else f", holds plugin {execution_class.plugin}" if execution_class.plugin else ""
        limit = "no class limit" if execution_class.class_limit == UNLIMITED else f"{execution_class.class_limit} at once"
        return ROW_LINE.format(name=execution_class.name, lane=execution_class.lane, cost=execution_class.slot_cost, priority=execution_class.priority.label,
                               limit=limit, holds=holds, origin=origin)
