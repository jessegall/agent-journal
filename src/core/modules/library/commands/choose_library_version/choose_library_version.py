from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.models.enums.kept_side import KeptSide
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class ChooseLibraryVersion(Command[LibraryCopy]):
    """Ends a conflict, a refused change or a new version to read by keeping the text of this journal or the
    library's."""

    lock = False

    copy_id: int
    keep: KeptSide
