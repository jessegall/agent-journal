from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.support.restored_library_item import RestoredLibraryItem


@dataclass(frozen=True)
class RestoreLibraryItem(Command[RestoredLibraryItem]):
    """Brings back a removed item of the shared server, or puts an old version of its text in again as a new version."""

    lock = False

    share: str
    item_id: int
    version: int | None = None
