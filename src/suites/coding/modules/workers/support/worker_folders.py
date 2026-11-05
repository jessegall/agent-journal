from pathlib import Path

from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerFolders(AgentFolders):
    """A worker works in its worktree, so a helper of a worker works there too."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery) -> None:
        super().__init__(queries)
        self.worktrees = worktrees

    def folder(self, agent: Agent) -> Path:
        worktree = self.worktrees.worker_worktree(agent.id)
        return Path(worktree.folder) if worktree is not None else super().folder(agent)
