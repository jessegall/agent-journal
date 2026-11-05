from collections.abc import Sequence

from core.base.library.library_hits import LibraryHits
from core.base.library.library_item import LibraryItem
from core.base.library.library_ref import LibraryRef


class LibraryLookup:
    """What find and read commands ask of a team's library. It answers nothing here; the library module binds
    its own, so a module that reads never depends on that one."""

    def hits(self, terms: Sequence[str], shares: Sequence[str]) -> LibraryHits:
        return LibraryHits()

    def item(self, share: str, ref: LibraryRef) -> LibraryItem | None:
        return None

    def title(self, share: str, item_id: int) -> str | None:
        return None

    def is_copy(self, share: str, row_id: int) -> bool:
        return False
