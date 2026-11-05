from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class LeaveLibraryCopy(Command[LibraryCopy]):
    """Stops a local row from following its item: the copy goes, and the row and the item stay as they are."""

    copy_id: int
