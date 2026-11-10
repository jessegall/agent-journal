from collections import Counter

from engine.query.conditions.has_value import HasValue
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.program_shares import ProgramShares
from suites.coding.modules.workers.models.worktree import Worktree

RECENT_WORKTREES_COUNT = 50


class WorkerCounts:
    """Counts dispatched tasks in the latest 50 cut worktrees after the split changed."""

    def __init__(self, queries: Queries, shares: ProgramShares, scopes: Scopes) -> None:
        self.queries, self.shares, self.scopes = queries, shares, scopes

    def recent(self, environment_id: int | None) -> Counter[str]:
        with self.scopes.opened(None, environment_id):
            return self.counted()

    def counted(self) -> Counter[str]:
        query = self.queries.query(Worktree).with_removed().matching(HasValue("cut_at"))
        changed_at = self.shares.changed_at()
        if changed_at is not None:
            query = query.matching(Minimum("cut_at", changed_at.text))
        worktrees = query.descending("cut_at", "id").limited(RECENT_WORKTREES_COUNT)
        agents = self.queries.query(Agent).find_many(list(dict.fromkeys(row.session_agent_id for row in worktrees)))
        programs = {agent.id: agent.program for agent in agents}
        counts: Counter[str] = Counter()
        for worktree in worktrees:
            counts[programs[worktree.session_agent_id]] += worktree.task_count
        return counts
