from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.end_agent import EndAgent


class EndAgentHandler(Handler[EndAgent, Agent]):
    """Marks a session ended at the command's time and clears its process, so a reused pid never names it."""

    command = EndAgent

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EndAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.row_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already", f"journal agent show {agent.id}")
        return self.repository.save(replace(agent, ended_at=context.timestamp, pid=None, process_started_at=None), context)
