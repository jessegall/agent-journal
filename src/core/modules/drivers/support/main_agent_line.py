from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.models.agent_line import AgentLine


class MainAgentLine:
    """Gives the running main agent of an environment a line at its next hook."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def send(self, environment_id: int, text: str, source: str, context: Context) -> None:
        for agent in MainAgentFinder.rows(self.queries, environment_id):
            self.repository.save(AgentLine(agent_id=agent.id, creator_id=context.actor.id, text=text, source=source), context)
