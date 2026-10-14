from dataclasses import dataclass

from supervisor.instructions.instruction import Instruction


@dataclass(frozen=True)
class Type(Instruction):
    """Type this line into the agent."""

    line: str
