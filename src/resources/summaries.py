from dataclasses import dataclass, field, fields

from resources.base import USER


@dataclass(frozen=True)
class Summary:
    """One row as the index holds it, so a listing need not open the row itself. A type's own indexed fields travel in `indexed`, since each type names its own."""

    n: int
    created: float = 0.0
    updated: float = 0.0
    deleted: float = 0.0
    completed: float = 0.0
    title: str = ""
    stamp: str = ""
    files: int = 0
    seen: tuple = ()
    refs: tuple = ()
    idempotency: str = ""
    part_of: str = ""
    draft_of: str = ""
    owner: str = ""
    hidden: bool = False
    indexed: dict = field(default_factory=dict)

    @classmethod
    def of_data(cls, data: dict) -> "Summary":
        own = {f.name for f in fields(cls)} - {"indexed"}
        return cls(**{name: value for name, value in data.items() if name in own and value is not None},
                   indexed={name: value for name, value in data.items() if name not in own})

    def open(self) -> bool:
        return not self.completed

    def unread(self) -> bool:
        """Whether the user has not seen it: what an overview counts as needing their attention."""
        return USER not in self.seen

    def listable(self, hidden_listed: bool) -> bool:
        """Whether a listing may show it at all: a deleted row never, a hidden one only where hidden rows are listed, and a row never written not yet."""
        return not self.deleted and (hidden_listed or not self.hidden) and self.updated > 0

    def overview_weight(self) -> tuple[int, int, int]:
        """What it adds to its type's overview: itself, whether it is open, and whether it is open and unread by the user."""
        if self.deleted or self.hidden:
            return (0, 0, 0)
        return (1, int(self.open()), int(self.open() and self.unread()))

    def listable_weight(self, hidden_listed: bool) -> tuple[int, int]:
        """What it adds to the rows a listing can show: itself, and whether it is open."""
        listable = self.listable(hidden_listed)
        return int(listable), int(listable and self.open())
