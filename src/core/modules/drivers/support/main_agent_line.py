from engine.command.context import Context
from engine.driver.agent_message import AgentMessage
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.message_sender import MessageSender


class MainAgentLine:
    """Gives the running main agent of an environment a line at its next hook, typed to it if it sits idle."""

    def __init__(self, queries: Queries, message_sender: MessageSender) -> None:
        self.queries, self.message_sender = queries, message_sender

    def send(self, text: str, source: str, context: Context) -> None:
        for agent in MainAgentFinder.rows(self.queries):
            self.message_sender.send_text(agent.id, text, source, context, wakes_agent=True)

    def send_agent_message(self, agent_message: AgentMessage, source: str, context: Context) -> None:
        for agent in MainAgentFinder.rows(self.queries):
            self.message_sender.send_agent_message(agent.id, agent_message, source, context, wakes_agent=True)
