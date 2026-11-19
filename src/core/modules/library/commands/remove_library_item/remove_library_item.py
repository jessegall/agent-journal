from dataclasses import dataclass

from engine.command.command import Command
from engine.library.library_item import LibraryItem


@dataclass(frozen=True)
class RemoveLibraryItem(Command[LibraryItem]):
    """Marks an item removed on the shared server; no local row is touched."""

    share: str
    item_id: int
