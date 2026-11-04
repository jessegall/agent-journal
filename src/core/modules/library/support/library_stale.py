from core.modules.library.support.library_failure import LibraryFailure
from core.modules.library.support.library_item import LibraryItem


class LibraryStale(LibraryFailure):
    """The server answered 409: someone else changed the item first, and the answer carries the newest version."""

    def __init__(self, reason: str, suggestion: str, current: LibraryItem) -> None:
        super().__init__(reason, suggestion)
        self.current = current
