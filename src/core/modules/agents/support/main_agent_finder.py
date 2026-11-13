from engine.enums.agent_role import AgentRole
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.agents.models.agent import MAIN_NUMBER, Agent
from core.modules.agents.queries.agent_query import AgentQuery

MAIN_IDS_REASON = "every agent asked about is checked for a main agent"


class MainAgentFinder:
    """The running main agent of an environment: its newest, should two ever run. The main agent's own row
    is the one numbered 1, running or not."""

    @staticmethod
    def rows(queries: Queries) -> tuple[Agent, ...]:
        row = MainAgentFinder.running(queries).newest().first()
        return () if row is None else tuple([row])

    @staticmethod
    def running(queries: Queries) -> AgentQuery:
        return AgentQuery(queries.database, queries.tables).running().filter(role=AgentRole.MAIN)

    @staticmethod
    def all_running(queries: Queries) -> tuple[Agent, ...]:
        return tuple(MainAgentFinder.running(queries).get())

    @staticmethod
    def latest(queries: Queries) -> Agent | None:
        return queries.query(Agent).filter(role=AgentRole.MAIN).newest().first()

    @staticmethod
    def newest_ids(queries: Queries, limit: int) -> list[int]:
        return [agent.id for agent in queries.query(Agent).filter(role=AgentRole.MAIN).newest().page(1, limit).rows]

    @staticmethod
    def numbered_one(queries: Queries) -> Agent | None:
        return queries.query(Agent).filter(role=AgentRole.MAIN, number=MAIN_NUMBER).first()

    @staticmethod
    def newest(queries: Queries) -> Agent | None:
        return next(iter(MainAgentFinder.rows(queries)), None)

    @staticmethod
    def main_ids(queries: Queries, agent_ids: tuple[int, ...]) -> set[int]:
        return {agent.id for agent in queries.query(Agent).filter(role=AgentRole.MAIN).matching(Among("id", agent_ids)).every_row(MAIN_IDS_REASON)}

    @staticmethod
    def is_main(queries: Queries, agent_id: int) -> bool:
        return queries.query(Agent).filter(id=agent_id, role=AgentRole.MAIN).exists()
