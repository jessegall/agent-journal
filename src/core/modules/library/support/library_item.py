from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.library.support.library_unreachable import LibraryUnreachable


@dataclass(frozen=True)
class LibraryItem:
    """One version of an item on the shared server: its share, number, version, the fields that travel and its last
    change."""

    share: str
    item_id: int
    version: int
    fields: Mapping[str, object]
    author: str
    changed_at: str

    @classmethod
    def parsed(cls, body: object) -> "LibraryItem":
        if not isinstance(body, dict):
            raise LibraryUnreachable.unreadable()
        try:
            return cls(str(body["kind"]), int(body["id"]), int(body["version"]), dict(body["fields"]), str(body.get("updated_by", "")), str(body.get("updated_at", "")))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachable.unreadable() from error
