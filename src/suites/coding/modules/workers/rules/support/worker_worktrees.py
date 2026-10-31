from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_role import AgentRole
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerWorktrees:
    """The worktrees a main agent's workers have out, and those of them delivered."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery) -> None:
        self.queries, self.worktrees = queries, worktrees

    def main_worktrees(self, main_id: int) -> list[Worktree]:
        workers = self.queries.query(Agent).filter(parent_id=main_id, role=AgentRole.WORKER).all_rows()
        worktrees = [self.worktrees.worker_worktree(worker.id) for worker in workers]
        return [worktree for worktree in worktrees if worktree is not None]

    def delivered(self, main_id: int) -> list[Worktree]:
        return [worktree for worktree in self.main_worktrees(main_id) if worktree.state is WorktreeState.DELIVERED]
