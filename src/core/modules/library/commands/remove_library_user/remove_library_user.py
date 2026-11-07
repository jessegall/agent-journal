from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.support.library_user import LibraryUser


@dataclass(frozen=True)
class RemoveLibraryUser(Command[LibraryUser]):
    """Removes a user from the shared server; the user's tokens stop working."""

    lock = False

    user_id: int
