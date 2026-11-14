from dataclasses import dataclass

from engine.command.command import Command
from engine.library.library_item import LibraryItem
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class MergeLibraryItem(Command[LibraryCopy]):
    """Brings the row of a copy to a newer version of its item and makes that version the new base. It is
    refused when the row changed since the round read it."""

    copy_id: int
    item: LibraryItem
    row_version: int
