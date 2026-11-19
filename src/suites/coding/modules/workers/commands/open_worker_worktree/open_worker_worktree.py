from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from suites.coding.modules.workers.support.opened_worker import OpenedWorker


@dataclass(frozen=True)
class OpenWorkerWorktree(Command[OpenedWorker]):
    """Saves a new worker's agent row and its worktree row, still new, before git cuts the worktree's folder. The
    worker branches that exist are read before this write, so no git runs while it holds the write turn."""

    start: StartAgent
    task_id: int
    taken_branches: frozenset[str]
    new_agent_reason: str = ""
    route_reason: str = ""
    starts_program: bool = True
