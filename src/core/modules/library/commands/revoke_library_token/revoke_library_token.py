from dataclasses import dataclass

from engine.command.command import Command
from core.modules.library.support.library_token import LibraryToken


@dataclass(frozen=True)
class RevokeLibraryToken(Command[LibraryToken]):
    """Stops a token of the shared server from working."""

    lock = False

    token_id: int
