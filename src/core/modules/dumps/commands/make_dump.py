from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.dumps.models.dump import Dump


@dataclass(frozen=True)
class MakeDump(Command[Dump]):
    """Pours notes and files into a dump of the environment, one item for each part, or one for the whole brief."""

    brief: str
    parts: tuple[str, ...] = ()
    files: tuple[str, ...] = ()
