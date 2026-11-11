from dataclasses import dataclass
from engine.command.command import Command
from core.modules.tasks.support.tasks_changed_together import TasksChangedTogether


@dataclass(frozen=True)
class ClearDelegatedTasks(Command[None], TasksChangedTogether):
    """Clears the open and started tasks delegated to an agent."""

    agent_id: int
