from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.support.shared_library_item import SharedLibraryItem


@dataclass(frozen=True)
class SendLibraryItem(Command[SharedLibraryItem]):
    """Shares a local row with the team: uploads its fields as a new item of the shared server and makes the row
    follow it."""

    lock = False

    share: str
    row_id: int
