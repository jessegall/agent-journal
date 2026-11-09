from core.base.agent_role import AgentRole
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.queries.agent_query import AgentQuery


class MainAgentFinder:
    """The running main agent of an environment: its newest, should two ever run."""

    @staticmethod
    def rows(queries: Queries) -> tuple[Agent, ...]:
        row = AgentQuery(queries.database, queries.tables).running().filter(role=AgentRole.MAIN).newest().first()
        return () if row is None else tuple([row])

    @staticmethod
    def all_running(queries: Queries) -> tuple[Agent, ...]:
        return tuple(AgentQuery(queries.database, queries.tables).running().filter(role=AgentRole.MAIN).all_rows())

    @staticmethod
    def sessions(queries: Queries, program: str) -> tuple[Agent, ...]:
        rows = queries.query(Agent).filter(role=AgentRole.MAIN, program=program).newest().all_rows()
        return tuple(sorted(rows, key=lambda agent: agent.ended_at is not None))

    @staticmethod
    def newest(queries: Queries) -> Agent | None:
        return next(iter(MainAgentFinder.rows(queries)), None)

    @staticmethod
    def main_ids(queries: Queries, agent_ids: tuple[int, ...]) -> set[int]:
        return {agent.id for agent in queries.query(Agent).filter(role=AgentRole.MAIN).matching(Among("id", agent_ids)).all_rows()}

    @staticmethod
    def is_main(queries: Queries, agent_id: int) -> bool:
        return queries.query(Agent).filter(id=agent_id, role=AgentRole.MAIN).exists()
