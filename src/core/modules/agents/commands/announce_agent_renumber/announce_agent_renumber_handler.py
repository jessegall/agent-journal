from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.database import Database
from engine.driver.message_sender import MessageSender
from engine.scope.actor_scope import ActorScope
from core.modules.agents.agent_messages.agent_renumbered_message import AgentRenumberedMessage
from core.modules.agents.commands.announce_agent_renumber.announce_agent_renumber import AnnounceAgentRenumber
from core.modules.agents.support.renumber_notices import RenumberNotices

RENUMBER_SOURCE = "agents.renumber"


class AnnounceAgentRenumberHandler(Handler[AnnounceAgentRenumber, None]):
    """Queues each unsaid renumber line for its agent's next prompt and marks it said."""

    command = AnnounceAgentRenumber
    disabled_scopes = [ActorScope]

    def __init__(self, database: Database, message_sender: MessageSender) -> None:
        self.notices, self.message_sender = RenumberNotices(database), message_sender

    def handle(self, command: AnnounceAgentRenumber, context: Context) -> None:
        lines = self.notices.lines()
        if not lines:
            return
        for agent_id, text in lines:
            self.message_sender.send(agent_id, AgentRenumberedMessage.declared(), RENUMBER_SOURCE, context, text=text)
        self.notices.mark(context.timestamp.text)
