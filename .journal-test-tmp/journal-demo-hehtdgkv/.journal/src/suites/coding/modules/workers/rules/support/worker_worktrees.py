from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerWorktrees:
    """The worktrees a main agent's workers have out, and those of them delivered."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery) -> None:
        self.queries, self.worktrees = queries, worktrees

    def main_worktrees(self, main_id: int) -> list[Worktree]:
        workers = list(self.queries.query(Agent).filter(parent_id=main_id, role=AgentRole.WORKER).all_rows())
        worktrees = self.worktrees.matching(Among("agent_id", [worker.id for worker in workers])).matching(IsNull("removed_at")).oldest().all_rows()
        worktree_index: dict[int, Worktree] = {}
        for worktree in worktrees:
            worktree_index.setdefault(worktree.agent_id, worktree)
        return [worktree_index[worker.id] for worker in workers if worker.id in worktree_index]

    def delivered(self, main_id: int) -> list[Worktree]:
        return [worktree for worktree in self.main_worktrees(main_id) if worktree.state is WorktreeState.DELIVERED]
