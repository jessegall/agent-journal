from dataclasses import dataclass

from engine.command.command import Command
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.copy_source import CopySource


@dataclass(frozen=True)
class SaveLibraryCopy(Command[LibraryCopy]):
    """Writes the copy that makes a local row follow an item of the shared server, with the version both sides agree
    on. The row is one that is here, or one made from the item in the same transaction."""

    share: str
    item_id: int
    base_version: int
    source: CopySource
