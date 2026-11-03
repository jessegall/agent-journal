from core.base.agent_role import AgentRole
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent


class MainAgentFinder:
    """The running main agent of an environment: its newest, should two ever run."""

    @staticmethod
    def rows(queries: Queries, environment_id: int) -> tuple[Agent, ...]:
        return tuple(queries.query(Agent).filter(environment_id=environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().limited(1))

    @staticmethod
    def all_running(queries: Queries) -> tuple[Agent, ...]:
        return tuple(queries.query(Agent).filter(role=AgentRole.MAIN).matching(IsNull("ended_at")).all_rows())

    @staticmethod
    def newest(queries: Queries, environment_id: int) -> Agent | None:
        return next(iter(MainAgentFinder.rows(queries, environment_id)), None)
