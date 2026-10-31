from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class WorkerDispatch:
    """What a dispatch made: the worker's agent row, its worktree, and the command line that starts its program."""

    worker: Agent
    worktree: Worktree
    command: tuple[str, ...]
