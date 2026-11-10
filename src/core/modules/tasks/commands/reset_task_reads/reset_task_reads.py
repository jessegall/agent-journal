from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ResetTaskReads(Command[None]):
    """Clears the tasks an agent read, as its context window was compacted."""

    agent_id: int
