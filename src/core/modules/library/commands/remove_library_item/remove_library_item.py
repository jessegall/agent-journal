from dataclasses import dataclass

from core.base.command.command import Command
from core.base.library.library_item import LibraryItem


@dataclass(frozen=True)
class RemoveLibraryItem(Command[LibraryItem]):
    """Marks an item removed on the shared server; no local row is touched."""

    lock = False

    share: str
    item_id: int
