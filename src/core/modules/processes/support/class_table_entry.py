from dataclasses import dataclass
from engine.execution.classes.execution_class import UNLIMITED, ExecutionClass
from core.modules.processes.support.class_table_json import ClassTableJson

ROW_LINE = "{name}: {pool} pool, cost {cost}, {priority}, {limit}{covers} ({origin})"


@dataclass(frozen=True)
class ClassTableEntry:
    """One class of the class table and where it comes from: built-in, changed or the person's own."""

    execution_class: ExecutionClass
    origin: str

    def line(self) -> str:
        execution_class = self.execution_class
        occupies = self.occupied_text()
        limit = "no class limit" if execution_class.class_limit == UNLIMITED else f"{execution_class.class_limit} at once"
        return ROW_LINE.format(name=execution_class.name, pool=execution_class.pool, cost=execution_class.slot_cost, priority=execution_class.priority.label,
                               limit=limit, covers=occupies, origin=self.origin)

    def json(self) -> ClassTableJson:
        execution_class = self.execution_class
        return ClassTableJson(**{"name": execution_class.name, "lane": execution_class.pool.value, "cost": execution_class.slot_cost, "priority": execution_class.priority.label,
                "limit": 0 if execution_class.class_limit == UNLIMITED else execution_class.class_limit, "pattern": execution_class.line_pattern,
                "plugin": execution_class.plugin, "origin": self.origin})

    # what the class holds: its line pattern, else its plugin's runs, else nothing to say
    def occupied_text(self) -> str:
        if self.execution_class.line_pattern:
            return f", holds {self.execution_class.line_pattern}"
        if self.execution_class.plugin:
            return f", holds plugin {self.execution_class.plugin}"
        return ""
