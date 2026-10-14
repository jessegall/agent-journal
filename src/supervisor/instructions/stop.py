from dataclasses import dataclass

from supervisor.instructions.instruction import Instruction


@dataclass(frozen=True)
class Stop(Instruction):
    """End the session: the agent, then the journal, then the supervisor."""
