from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.dumps.models.dump import Dump


@dataclass(frozen=True)
class NameDump(Command[Dump]):
    """Gives a dump the title the agent read from its notes."""

    dump_id: int
    title: str
