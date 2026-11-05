from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.dumps.models.dump import Dump


@dataclass(frozen=True)
class MakeDump(Command[Dump]):
    """Creates a project dump with an item for each part or the whole brief."""

    brief: str
    parts: tuple[str, ...] = ()
    files: tuple[str, ...] = ()
