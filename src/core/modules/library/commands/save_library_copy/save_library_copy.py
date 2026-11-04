from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class SaveLibraryCopy(Command[LibraryCopy]):
    """Writes the copy that makes a local row follow an item of the shared server, with the version and digest both
    sides agree on."""

    share: str
    item_id: int
    row_id: int
    base_version: int
    base_digest: str
