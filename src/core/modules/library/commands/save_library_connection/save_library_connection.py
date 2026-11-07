from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.models.library_connection import LibraryConnection


@dataclass(frozen=True)
class SaveLibraryConnection(Command[LibraryConnection]):
    """Writes the connection to a shared server after the server accepted the token, and clears why sync stopped."""

    address_text: str
    address: str
    server_key: str
    name: str
    user_name: str
    role: LibraryRole
