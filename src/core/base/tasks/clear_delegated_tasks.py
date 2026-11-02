from dataclasses import dataclass
from core.base.command.command import Command


@dataclass(frozen=True)
class ClearDelegatedTasks(Command[None]):
    """Takes the open and started tasks away from the worker they were delegated to."""

    agent_id: int
