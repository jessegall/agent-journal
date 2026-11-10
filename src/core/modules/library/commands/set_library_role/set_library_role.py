from dataclasses import dataclass

from engine.command.command import Command
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_user import LibraryUser


@dataclass(frozen=True)
class SetLibraryRole(Command[LibraryUser]):
    """Gives a user of the shared server another role."""

    lock = False

    user_id: int
    role: LibraryRole
