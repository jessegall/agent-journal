from dataclasses import dataclass

from engine.command.command import Command
from engine.enums.command_category import CommandCategory
from core.modules.aliases.models.alias import Alias


@dataclass(frozen=True)
class EditAlias(Command[Alias]):
    """Changes only the alias fields supplied by the command."""

    name: str
    line: str | None
    reader_name: str | None
    description: str | None
    background: bool | None
    agent_access: bool | None
    category: CommandCategory | None = None
