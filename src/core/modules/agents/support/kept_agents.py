from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent


class KeptAgents:
    """Reads which agents of the current environment are kept and which are retired. Retirement alone decides it:
    ended_at says whether the agent's process runs."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def kept(self) -> tuple[Agent, ...]:
        return tuple(self.queries.query(Agent).matching(IsNull("retired_at")).all_rows())

    def retired(self) -> tuple[Agent, ...]:
        kept_ids = {agent.id for agent in self.kept()}
        return tuple(agent for agent in self.queries.query(Agent).all_rows() if agent.id not in kept_ids)
