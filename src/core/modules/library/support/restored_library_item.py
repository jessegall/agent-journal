from dataclasses import dataclass

from engine.library.library_item import LibraryItem


@dataclass(frozen=True)
class RestoredLibraryItem:
    """An item brought back on the server, as the new version it now is, and the old version whose text was put in
    again, when one was named."""

    item: LibraryItem
    old_version: int | None
