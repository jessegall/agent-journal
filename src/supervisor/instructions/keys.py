from dataclasses import dataclass

from supervisor.instructions.instruction import Instruction


@dataclass(frozen=True)
class Keys(Instruction):
    """Write these keys to the agent's terminal as they are, with no Enter after them: an arrow, Enter, Escape."""

    keys: str
