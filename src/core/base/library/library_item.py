from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class LibraryItem:
    """One version of an item on the shared server: its share, number, version, the fields that travel, who made
    it and who changed it last."""

    share: str
    item_id: int
    version: int
    fields: Mapping[str, object]
    creator: str
    author: str
    changed_at: str
    removed_at: str = ""

    @property
    def is_removed(self) -> bool:
        return bool(self.removed_at)

    def lines(self) -> Sequence[str]:
        return [f"{self.share} {self.item_id}  version {self.version}  by {self.author}  {self.changed_at}", *(f"{name}: {value}" for name, value in self.fields.items())]

    def json(self) -> Mapping[str, object]:
        return {"kind": self.share, "id": self.item_id, "version": self.version, "fields": dict(self.fields), "creator": self.creator, "updated_by": self.author,
                "updated_at": self.changed_at, "removed_at": self.removed_at}
