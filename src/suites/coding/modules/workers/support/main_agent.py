from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine

LINE_SOURCE = "workers"


class MainAgent:
    """The running main agent of an environment, and a line for it at its next hook."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def running(self, environment_id: int) -> Agent | None:
        rows = self.queries.query(Agent).filter(environment_id=environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().page(1, 1).rows
        return rows[0] if rows else None

    def send_line(self, environment_id: int, text: str, context: Context) -> None:
        agent = self.running(environment_id)
        if agent is not None:
            self.repository.save(AgentLine(agent_id=agent.id, creator_id=context.actor.id, text=text, source=LINE_SOURCE), context)
