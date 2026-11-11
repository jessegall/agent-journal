from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.command.errors.completed_command_error import CompletedCommandError
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_label import AgentLabel


class EndAgentHandler(Handler[EndAgent, Agent]):
    """Has the dispatcher end an agent's row, which keeps its process identity for safe resume checks; an agent
    that ends its own session while the launcher still has its program is ended by the program's exit."""

    command = EndAgent
    runs_once = True

    def __init__(self, rows: EventRows, dispatcher: AgentDispatcher) -> None:
        self.rows, self.dispatcher = rows, dispatcher

    def handle(self, command: EndAgent, context: Context) -> Agent:
        agent = self.rows.required(Agent, command.row_id)
        if agent.ended_at is not None:
            raise CompletedCommandError(f"{AgentLabel.from_agent(agent).text} has ended already", f"journal agent show {agent.number}")
        return self.dispatcher.end_session(agent, context)
