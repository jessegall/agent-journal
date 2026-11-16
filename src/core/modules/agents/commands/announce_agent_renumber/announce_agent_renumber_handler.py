from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.database import Database
from engine.driver.message_sender import MessageSender
from engine.scope.actor_scope import ActorScope
from core.modules.agents.agent_messages.agent_renumbered_message import AgentRenumberedMessage
from core.modules.agents.agent_messages.agents_renumbered_message import AgentsRenumberedMessage
from engine.actor.actor import MAIN_AGENT_ID
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
        lines, summary = self.notices.agent_lines(), self.notices.summary()
        if not lines and summary is None:
            return
        for agent_id, fields in lines:
            self.message_sender.send(agent_id, AgentRenumberedMessage.declared(), RENUMBER_SOURCE, context, **fields)
        if summary is not None:
            self.message_sender.send(MAIN_AGENT_ID, AgentsRenumberedMessage.declared(), RENUMBER_SOURCE, context, **summary)
        self.notices.mark(context.timestamp.text)
