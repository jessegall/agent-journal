from core.base.query.queries import Queries
from core.base.database.kept_rows import KeptRows
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerWorktrees:
    """The worktrees a main agent's workers have out, and those of them delivered."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, kept: KeptRows) -> None:
        self.queries, self.worktrees = queries, worktrees
        self.kept = kept

    def main_worktrees(self, main_id: int) -> list[Worktree]:
        workers = self.kept.read("agents", lambda: tuple(self.queries.query(Agent).filter(parent_id=main_id, role=AgentRole.WORKER).all_rows()),
                                 "parent_id = ? AND role = ?", [main_id, AgentRole.WORKER], name="workers.main_workers")
        if not workers:
            return []
        worker_ids = {worker.id for worker in workers}
        worktrees = [worktree for worktree in self.worktrees.environment_worktrees(workers[0].environment_id) if worktree.agent_id in worker_ids]
        worktree_index: dict[int, Worktree] = {}
        for worktree in worktrees:
            worktree_index.setdefault(worktree.agent_id, worktree)
        return [worktree_index[worker.id] for worker in workers if worker.id in worktree_index]

    def delivered(self, main_id: int) -> list[Worktree]:
        return [worktree for worktree in self.main_worktrees(main_id) if worktree.state is WorktreeState.DELIVERED]
