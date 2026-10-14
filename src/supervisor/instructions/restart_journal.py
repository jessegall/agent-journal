from dataclasses import dataclass

from supervisor.instructions.instruction import Instruction


@dataclass(frozen=True)
class RestartJournal(Instruction):
    """Stop the journal server and start it again, as after an upgrade."""
