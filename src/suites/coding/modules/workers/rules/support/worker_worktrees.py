from core.base.query.queries import Queries
from core.base.database.kept_rows import KeptRows
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_helper_kind import CodingHelperKind
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerWorktrees:
    """The worktrees the workers of the current environment have out, and those of them delivered: every main
    agent of an environment counts as one."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, kept: KeptRows) -> None:
        self.queries, self.worktrees = queries, worktrees
        self.kept = kept

    def main_worktrees(self) -> list[Worktree]:
        workers = self.kept.scoped_read("agents", lambda: tuple(self.queries.query(Agent).filter(role=CodingHelperKind.WORKER).all_rows()),
                                        "role = ?", [CodingHelperKind.WORKER], name="workers.main_workers")
        if not workers:
            return []
        worker_ids = {worker.id for worker in workers}
        worktrees = [worktree for worktree in self.worktrees.open_worktrees() if worktree.session_agent_id in worker_ids]
        worktree_index: dict[int, Worktree] = {}
        for worktree in worktrees:
            worktree_index.setdefault(worktree.session_agent_id, worktree)
        return [worktree_index[worker.id] for worker in workers if worker.id in worktree_index]

    def delivered(self) -> list[Worktree]:
        return [worktree for worktree in self.main_worktrees() if worktree.state is WorktreeState.DELIVERED]
