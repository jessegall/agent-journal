from dataclasses import dataclass, field, fields

from journal.models.entry import Entry
from journal.models.support.entry_data import EntryData
from journal.support.walk_stop import WalkStop


@dataclass(frozen=True)
class WalkRecord(EntryData):
    """What a walk entry holds: the nodes the walk passed, what it said and whether it held, the moves it made and where each path stopped."""

    trigger: str
    session: str = ""
    state: str = ""
    started: str = ""
    workflows: tuple[int, ...] = ()
    nodes: tuple[int, ...] = ()
    allowed: bool = True
    said: str = ""
    unanswered: tuple[int, ...] = ()
    moved_by: tuple[int, ...] = ()
    stopped_at: int = 0
    moved_to: str = ""
    row: int = 0
    read: dict[str, int] = field(default_factory=dict)
    """What each count check read, by node."""
    stops: tuple[WalkStop, ...] = ()
    at: float = 0.0
    """When it was recorded, read from its entry and never stored in the entry's data."""

    @classmethod
    def from_entry(cls, entry: Entry) -> "WalkRecord":
        """The record an entry holds; one written before a field existed takes that field's default."""
        known = {f.name for f in fields(cls)} - {"stops", "at"}
        data = {name: tuple(value) if isinstance(value, list) else value for name, value in entry.data.items() if name in known}
        return cls(**data, stops=tuple(WalkStop(**stop) for stop in entry.data.get("stops", ())), at=entry.created_at.timestamp())

    def passed_any(self, nodes: set[int]) -> bool:
        return bool(nodes.intersection(self.nodes))

    def answer_words(self) -> str:
        """The answer the walk gave the agent, in words: held with the line, or the line said."""
        if not self.allowed:
            return f"Held: {self.said}" if self.said else "Held"
        return f"Said: {self.said}" if self.said else ""

    def count_words(self) -> str:
        """The counts the walk left its workflows with, in words: reminders 3, edits 2."""
        counted = {name: value for stop in self.stops for name, value in stop.counts.items()}
        return ", ".join(f"{name} {value}" for name, value in counted.items())
