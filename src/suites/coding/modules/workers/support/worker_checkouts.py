from pathlib import Path

from core.base.checkout import Checkout
from core.base.query.queries import Queries
from core.modules.agents.bindings.agent_project_checkouts import AgentProjectCheckouts
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerCheckouts(AgentProjectCheckouts):
    """A worker works in the newest worktree it was given, also once that is removed; an agent it started takes the
    checkout of its parent; any other agent works in the project."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery) -> None:
        super().__init__(queries)
        self.worktrees = worktrees

    def checkout(self, agent_id: int) -> Checkout:
        agent = self.queries.query(Agent).find(agent_id)
        worktree = self.worktrees.newest_worktree(agent_id)
        if worktree is not None:
            folder = Path(worktree.folder)
            return Checkout.of_copy(folder, Path(self.environment(agent).folder), worktree.branch, worktree.base_branch, worktree.base_commit, worktree.removed_at is None and folder.is_dir())
        return self.checkout(agent.parent_id) if agent.parent_id is not None else super().checkout(agent_id)
