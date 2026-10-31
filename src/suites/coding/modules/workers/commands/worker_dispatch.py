from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.agent import Agent


@dataclass(frozen=True)
class WorkerDispatch(Command[Agent]):
    """Starts a worker on an open task, in a worktree cut from the environment's branch."""

    task_id: int
