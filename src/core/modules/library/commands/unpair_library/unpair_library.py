from dataclasses import dataclass

from engine.command.command import Command
from core.modules.library.support.library_disconnection import LibraryDisconnection


@dataclass(frozen=True)
class UnpairLibrary(Command[LibraryDisconnection]):
    """Removes the token and stops sync; the copies stay and wait, or go with the connection when include_copies
    is set."""

    lock = True

    include_copies: bool = False
