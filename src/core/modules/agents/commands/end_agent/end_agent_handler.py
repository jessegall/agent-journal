from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.command.errors.completed_command_error import CompletedCommandError
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_label import AgentLabel


class EndAgentHandler(Handler[EndAgent, Agent]):
    """Marks a session ended while retaining its process identity for safe resume checks."""

    command = EndAgent
    runs_once = True

    def __init__(self, rows: EventRows, dispatcher: AgentDispatcher) -> None:
        self.rows, self.dispatcher = rows, dispatcher

    def handle(self, command: EndAgent, context: Context) -> Agent:
        agent = self.rows.required(Agent, command.row_id)
        if agent.ended_at is not None:
            raise CompletedCommandError(f"{AgentLabel.from_agent(agent).text} has ended already", f"journal agent show {agent.number}")
        return self.dispatcher.end_row(agent, context)
