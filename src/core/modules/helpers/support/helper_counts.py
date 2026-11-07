from collections import Counter

from core.base.query.conditions.minimum import Minimum
from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.program_shares import ProgramShares

RECENT_HELPERS_COUNT = 50


class HelperCounts:
    """Counts the latest 50 helper jobs after the effective split changed, including reused sessions."""

    def __init__(self, queries: Queries, shares: ProgramShares, scopes: Scopes) -> None:
        self.queries, self.shares, self.scopes = queries, shares, scopes

    def recent(self, environment_id: int | None) -> Counter[str]:
        with self.scopes.opened(None, environment_id):
            query = self.queries.query(HelperJob).matching(Minimum("helper_id", 1))
            changed_at = self.shares.changed_at()
            if changed_at is not None:
                query = query.matching(Minimum("created_at", changed_at.text))
            jobs = tuple(query.descending("created_at", "id").limited(RECENT_HELPERS_COUNT))
            helper_ids = tuple(job.helper_id for job in jobs if job.helper_id is not None)
            agents = {agent.id: agent for agent in self.queries.query(Agent).find_many(tuple(set(helper_ids)))} if helper_ids else {}
            return Counter(agents[helper_id].program for helper_id in helper_ids)
