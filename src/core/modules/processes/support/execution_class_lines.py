from core.modules.processes.support.installed_plugins import InstalledPlugins
from engine.execution.classes.builtin_classes import BUILTIN_CLASSES
from engine.query.queries import Queries
from core.modules.processes.models.execution_class_row import ExecutionClassRow
from core.modules.processes.support.stored_execution_classes import STORED_CLASSES_REASON
from core.modules.processes.support.execution_class_table import ClassTableEntry


class ExecutionClassLines:
    """The class table as lines a person reads: every built-in class as it stands, changed or default, then each
    class of the person's own; a class of a plugin that is not installed is hidden until the plugin is back."""

    def __init__(self, queries: Queries, plugins: InstalledPlugins) -> None:
        self.queries, self.plugins = queries, plugins

    def entries(self) -> tuple[ClassTableEntry, ...]:
        stored = {row.name: row for row in self.queries.query(ExecutionClassRow).every_row(STORED_CLASSES_REASON)}
        built_in = [ClassTableEntry(stored[row.execution_class.name].execution_class, "changed") if row.execution_class.name in stored
                    else ClassTableEntry(row.execution_class, "built-in") for row in BUILTIN_CLASSES]
        own = [ClassTableEntry(row.execution_class, "your own") for name, row in stored.items()
               if not row.is_override and (not row.execution_class.plugin or self.plugins.is_installed(row.execution_class.plugin))]
        return (*built_in, *own)

    def lines(self) -> list[str]:
        return [entry.line() for entry in self.entries()]
