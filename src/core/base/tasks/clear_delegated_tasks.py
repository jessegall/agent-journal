from dataclasses import dataclass
from core.base.command.command import Command


@dataclass(frozen=True)
class ClearDelegatedTasks(Command[None]):
    """Takes every unfinished task away from the worker it was delegated to."""

    agent_id: int
