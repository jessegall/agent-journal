from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.command.completed_command_error import CompletedCommandError
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.support.current_agent_policy import CurrentAgentPolicy


class EndAgentHandler(Handler[EndAgent, Agent]):
    """Marks a session ended while retaining its process identity for safe resume checks."""

    command = EndAgent
    runs_once = True

    def __init__(self, rows: EventRows, repository: Repository, suites: CurrentAgentPolicy) -> None:
        self.rows, self.repository, self.suites = rows, repository, suites

    def handle(self, command: EndAgent, context: Context) -> Agent:
        agent = self.rows.required(Agent, command.row_id)
        if agent.ended_at is not None:
            raise CompletedCommandError(f"agent {agent.id} has ended already", f"journal agent show {agent.id}")
        return self.repository.save_change(agent, agent.ended(context.timestamp, self.suites.agent_policy()), context)
