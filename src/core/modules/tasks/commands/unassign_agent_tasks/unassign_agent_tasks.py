from dataclasses import dataclass
from engine.command.command import Command
from core.modules.tasks.support.tasks_changed_together import TasksChangedTogether


@dataclass(frozen=True)
class UnassignAgentTasks(Command[None], TasksChangedTogether):
    """Takes the open and started tasks assigned to an agent away from it."""

    agent_id: int
