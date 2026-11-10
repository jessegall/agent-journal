from dataclasses import dataclass

from engine.command.command import Command
from core.modules.library.support.new_library_copy import NewLibraryCopy


@dataclass(frozen=True)
class MakeLibraryCopy(Command[NewLibraryCopy]):
    """Fetches an item of the shared server, makes a local row from it and makes that row follow the item."""

    lock = False

    share: str
    item_id: int
    has_read: bool
