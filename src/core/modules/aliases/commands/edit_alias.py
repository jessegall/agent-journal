from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.aliases.models.alias import Alias


@dataclass(frozen=True)
class EditAlias(Command[Alias]):
    """Changes an alias's line, reader, description, background flag or worker access, each only when given."""

    name: str
    line: str | None
    reader_name: str | None
    description: str | None
    background: bool | None
    worker_access: bool | None
