from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent

KEPT_AGENTS_REASON = "the agent list shows every agent that is not retired"
RETIRED_AGENTS_REASON = "the agent list shows every retired agent"


class KeptAgents:
    """Reads which agents of the current environment are kept and which are retired. Retirement alone decides it:
    ended_at says whether the agent's process runs."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def kept(self) -> tuple[Agent, ...]:
        return tuple(self.queries.query(Agent).matching(IsNull("retired_at")).every_row(KEPT_AGENTS_REASON))

    def retired(self) -> tuple[Agent, ...]:
        return tuple(self.queries.query(Agent).where_not_null("retired_at").every_row(RETIRED_AGENTS_REASON))
