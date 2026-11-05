from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class DeleteLibraryCopy(Command[LibraryCopy]):
    """Deletes a copy whose row left this journal. It never reaches the server."""

    copy_id: int
