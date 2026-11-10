from dataclasses import dataclass

from core.modules.library.models.library_copy import LibraryCopy
from engine.library.library_item import LibraryItem


@dataclass(frozen=True)
class SharedLibraryItem:
    """A local row just shared: the copy that now follows its item on the server, that item, and the warning for the
    person, if the text names rows."""

    copy: LibraryCopy
    item: LibraryItem
    warning: str
