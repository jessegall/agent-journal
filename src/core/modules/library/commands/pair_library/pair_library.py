from dataclasses import dataclass, field

from engine.command.command import Command
from core.modules.library.models.library_connection import LibraryConnection


@dataclass(frozen=True)
class PairLibrary(Command[LibraryConnection]):
    """Connects this journal to a shared server: checks the address and token against the server, keeps the token out
    of the project, and writes the connection."""

    lock = False

    token: str = field(repr=False)
    address: str = ""
    certificate: str = ""
