from dataclasses import dataclass

from supervisor.instructions.instruction import Instruction


@dataclass(frozen=True)
class Type(Instruction):
    """Type this line into the agent, after so many seconds: a line for an agent still starting waits until its prompt is up."""

    line: str
    after: float = 0.0
