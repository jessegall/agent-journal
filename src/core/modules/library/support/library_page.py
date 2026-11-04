from collections.abc import Mapping, Sequence
from dataclasses import dataclass, replace

from core.base.library.library_hit import LibraryHit
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.item_summary import ItemSummary


@dataclass(frozen=True)
class LibraryPage:
    """One page of the server's list in the shape the viewer's rows read: the page, its size, the total and the rows."""

    number: int
    size: int
    total: int
    items: tuple[ItemSummary, ...]

    @classmethod
    def parsed(cls, body: object) -> "LibraryPage":
        if not isinstance(body, dict):
            raise LibraryUnreachableError.unreadable()
        try:
            return cls(int(body["page"]), int(body["size"]), int(body["total"]), tuple(ItemSummary.parsed(row) for row in body["rows"]))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error

    @property
    def is_last(self) -> bool:
        return self.number * self.size >= self.total

    def hits(self) -> tuple[LibraryHit, ...]:
        return tuple(item.hit() for item in self.items)

    def with_copies(self, copy_ids: Mapping[int, int]) -> "LibraryPage":
        return replace(self, items=tuple(item.with_copy(copy_ids.get(item.item_id)) for item in self.items))

    def lines(self) -> Sequence[str]:
        listed = [line for item in self.items for line in item.lines()] or ["nothing found"]
        return listed if self.is_last else [*listed, f"page {self.number}, {len(self.items)} of {self.total} rows: --page {self.number + 1} for the next"]

    def json(self) -> Mapping[str, object]:
        return {"page": self.number, "size": self.size, "total": self.total, "rows": [item.json() for item in self.items]}
