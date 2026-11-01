from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.sequences.commands.support.sequence_line import SequenceLine


@dataclass(frozen=True)
class MoveSequenceRun(Command[SequenceLine]):
    """Moves the calling agent's sequence run: start runs the sequence named, follow takes the step up, next moves
    on or ends it, and abandon gives it up, only with --sure once it was told what it leaves undone."""

    action: str
    sequence_id: int | None = None
    reason: str = ""
    sure: bool = False
