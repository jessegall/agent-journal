from core.base.agent_role import AgentRole
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent


class MainAgentFinder:
    """The running main agent of an environment: its newest, should two ever run."""

    @staticmethod
    def rows(queries: Queries) -> tuple[Agent, ...]:
        row = queries.query(Agent).filter(role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().first()
        return () if row is None else tuple([row])

    @staticmethod
    def all_running(queries: Queries) -> tuple[Agent, ...]:
        return tuple(queries.query(Agent).filter(role=AgentRole.MAIN).matching(IsNull("ended_at")).all_rows())

    @staticmethod
    def newest(queries: Queries) -> Agent | None:
        return next(iter(MainAgentFinder.rows(queries)), None)

    @staticmethod
    def main_ids(queries: Queries, agent_ids: tuple[int, ...]) -> set[int]:
        return {agent.id for agent in queries.query(Agent).filter(role=AgentRole.MAIN).matching(Among("id", agent_ids)).all_rows()}
