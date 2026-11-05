from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ResetTaskReads(Command[None]):
    """Forgets the tasks an agent read, as its context window was compacted."""

    agent_id: int
