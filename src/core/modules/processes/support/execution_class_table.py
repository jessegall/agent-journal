from collections.abc import Mapping
from dataclasses import dataclass


from core.modules.processes.support.class_table_entry import ClassTableEntry
ROW_LINE = "{name}: {lane} lane, cost {cost}, {priority}, {limit}{holds} ({origin})"


@dataclass(frozen=True)
class ExecutionClassTable:
    """The class table as lines a person reads and as JSON, with the lane settings beside it."""

    entries: tuple[ClassTableEntry, ...]
    settings: tuple[Mapping[str, object], ...] = ()

    def lines(self) -> list[str]:
        return [entry.line() for entry in self.entries]

    def json(self) -> dict[str, object]:
        return {"classes": [entry.json() for entry in self.entries], "settings": list(self.settings)}
