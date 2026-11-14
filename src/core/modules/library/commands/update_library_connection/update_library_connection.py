from dataclasses import dataclass

from engine.command.command import Command
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.models.library_connection import LibraryConnection


@dataclass(frozen=True)
class UpdateLibraryConnection(Command[LibraryConnection]):
    """Writes what a round found about the connection: the role the server gives, the last failure, why sync stopped,
    and, when the server answered, the time it was reached. A failure or a stop that is not given is cleared."""

    role: LibraryRole
    failure: str = ""
    stopped: str = ""
    has_reached: bool = False
