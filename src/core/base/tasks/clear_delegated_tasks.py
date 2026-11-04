from dataclasses import dataclass
from core.base.command.command import Command


@dataclass(frozen=True)
class ClearDelegatedTasks(Command[None]):
    """Clears the open and started tasks delegated to an agent."""

    agent_id: int
