from dataclasses import asdict, dataclass

from journal.models.entry import Entry


@dataclass(frozen=True)
class WalkFailure:
    """What a walk entry of a node that raised holds: the node, its key and the fault's words."""

    session: str
    workflow: int
    node: int
    key: str
    fault: str
    at: float = 0.0
    """When it was recorded, read from its entry and never stored in the entry's data."""

    @classmethod
    def from_entry(cls, entry: Entry) -> "WalkFailure":
        return cls(**entry.data, at=entry.created_at.timestamp())

    def to_data(self) -> dict:
        return {name: value for name, value in asdict(self).items() if name != "at"}
