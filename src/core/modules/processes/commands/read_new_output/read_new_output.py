from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.output import Output
from core.modules.processes.support.prepared_read import PreparedRead


@dataclass(frozen=True)
class ReadNewOutput(Command[Output]):
    """Passes the bytes an output gained since the reader last looked through its reader, keeps what came out
    of it, and, at the output's end, the rest. A tick hands in what it read before the transaction."""

    process_id: int
    is_final: bool = False
    prepared: PreparedRead | None = None
