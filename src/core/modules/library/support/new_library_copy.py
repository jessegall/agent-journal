from dataclasses import dataclass

from engine.library.library_item import LibraryItem
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class NewLibraryCopy:
    """A copy just made from an item of the shared server: the copy that makes the new local row follow it, and the
    item."""

    copy: LibraryCopy
    item: LibraryItem
