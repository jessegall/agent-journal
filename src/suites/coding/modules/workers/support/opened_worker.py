from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class OpenedWorker:
    """A new worker's agent row and its worktree row, saved before git cuts the folder."""

    worker: Agent
    worktree: Worktree
