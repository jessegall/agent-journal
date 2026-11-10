from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.database.kept_rows import KeptRows
from core.modules.agents.models.agent import Agent
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerWorktrees:
    """The worktrees the workers of the current environment have out, and those of them delivered: every main
    agent of an environment counts as one. Only the workers that own an open worktree are read."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, kept: KeptRows) -> None:
        self.queries, self.worktrees = queries, worktrees
        self.kept = kept

    def main_worktrees(self) -> list[Worktree]:
        worktree_index: dict[int, Worktree] = {}
        for worktree in self.worktrees.open_worktrees():
            worktree_index.setdefault(worktree.session_agent_id, worktree)
        owner_ids = sorted(worktree_index)
        if not owner_ids:
            return []
        workers = self.kept.scoped_read("agents", lambda: tuple(self.queries.query(Agent).filter(role=CodingHelperRole.WORKER).matching(Among("id", owner_ids)).oldest().all_rows()),
                                        "role = ?", [CodingHelperRole.WORKER], name=f"workers.main_workers:{owner_ids}")
        return [worktree_index[worker.id] for worker in workers]

    def delivered(self) -> list[Worktree]:
        return [worktree for worktree in self.main_worktrees() if worktree.state is WorktreeState.DELIVERED]
