from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.new_library_user import NewLibraryUser


@dataclass(frozen=True)
class AddLibraryUser(Command[NewLibraryUser]):
    """Adds a user to the shared server with a role, and gets the first token of that user."""

    lock = False

    name: str
    role: LibraryRole
