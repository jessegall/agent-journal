from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class AssignTask(Command[Task]):
    """Gives a task to an agent. A reserved task waits for that agent alone; an unreserved one stays free for
    the agent to take or hand out."""

    task_id: int
    agent_id: int
    reserved: bool = True
