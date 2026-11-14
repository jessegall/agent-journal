from collections.abc import Mapping
from dataclasses import dataclass

from engine.execution.classes.execution_class import UNLIMITED, ExecutionClass

ROW_LINE = "{name}: {lane} lane, cost {cost}, {priority}, {limit}{holds} ({origin})"


@dataclass(frozen=True)
class ClassTableEntry:
    """One class of the class table and where it comes from: built-in, changed or the person's own."""

    execution_class: ExecutionClass
    origin: str

    def line(self) -> str:
        execution_class = self.execution_class
        holds = f", holds {execution_class.line_pattern}" if execution_class.line_pattern else f", holds plugin {execution_class.plugin}" if execution_class.plugin else ""
        limit = "no class limit" if execution_class.class_limit == UNLIMITED else f"{execution_class.class_limit} at once"
        return ROW_LINE.format(name=execution_class.name, lane=execution_class.lane, cost=execution_class.slot_cost, priority=execution_class.priority.label,
                               limit=limit, holds=holds, origin=self.origin)

    def json(self) -> dict[str, object]:
        execution_class = self.execution_class
        return {"name": execution_class.name, "lane": execution_class.lane.value, "cost": execution_class.slot_cost, "priority": execution_class.priority.label,
                "limit": 0 if execution_class.class_limit == UNLIMITED else execution_class.class_limit, "pattern": execution_class.line_pattern,
                "plugin": execution_class.plugin, "origin": self.origin}


@dataclass(frozen=True)
class ExecutionClassTable:
    """The class table as lines a person reads and as JSON, with the lane settings beside it."""

    entries: tuple[ClassTableEntry, ...]
    settings: tuple[Mapping[str, object], ...] = ()

    def lines(self) -> list[str]:
        return [entry.line() for entry in self.entries]

    def json(self) -> dict[str, object]:
        return {"classes": [entry.json() for entry in self.entries], "settings": list(self.settings)}
