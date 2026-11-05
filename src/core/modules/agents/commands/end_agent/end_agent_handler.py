from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.drivers.support.suite_choice import SuiteChoice


class EndAgentHandler(Handler[EndAgent, Agent]):
    """Marks a session ended while retaining its process identity for safe resume checks."""

    command = EndAgent

    def __init__(self, queries: Queries, repository: Repository, suites: SuiteChoice) -> None:
        self.queries, self.repository, self.suites = queries, repository, suites

    def handle(self, command: EndAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.row_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already", f"journal agent show {agent.id}")
        return self.repository.save_change(agent, agent.ended(context.timestamp, self.suites.agent_policy(agent.environment_id)), context)
