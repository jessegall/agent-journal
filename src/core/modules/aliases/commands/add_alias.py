from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.aliases.models.alias import Alias


@dataclass(frozen=True)
class AddAlias(Command[Alias]):
    """Adds a word of the project's own for a shell line."""

    name: str
    line: str
    reader_name: str | None
    description: str
    variables: tuple[str, ...]
    background: bool
