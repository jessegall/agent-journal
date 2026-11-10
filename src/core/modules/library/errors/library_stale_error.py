from core.modules.library.errors.library_failure_error import LibraryFailureError
from engine.library.library_item import LibraryItem


class LibraryStaleError(LibraryFailureError):
    """The server answered 409: someone else changed the item first, and the answer carries the newest version."""

    def __init__(self, reason: str, suggestion: str, current: LibraryItem) -> None:
        super().__init__(reason, suggestion)
        self.current = current
