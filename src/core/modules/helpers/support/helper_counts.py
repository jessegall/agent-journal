from collections import Counter

from core.base.agent_role import AgentRole
from core.base.query.conditions.minimum import Minimum
from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.program_shares import ProgramShares

RECENT_HELPERS_COUNT = 50


class HelperCounts:
    """Counts the latest 50 helper starts after the effective split changed."""

    def __init__(self, queries: Queries, shares: ProgramShares, scopes: Scopes) -> None:
        self.queries, self.shares, self.scopes = queries, shares, scopes

    def recent(self, environment_id: int | None) -> Counter[str]:
        with self.scopes.opened(None, environment_id):
            query = self.queries.query(Agent).filter(role=AgentRole.HELPER)
            changed_at = self.shares.changed_at()
            if changed_at is not None:
                query = query.matching(Minimum("created_at", changed_at.text))
            return Counter(agent.program for agent in query.newest().limited(RECENT_HELPERS_COUNT))
