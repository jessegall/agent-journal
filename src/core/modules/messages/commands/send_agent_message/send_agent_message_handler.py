from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.receivers import Receivers
from core.modules.agents.support.report_nudges import PARENT_REPORT, PARENT_REPORT_SOURCE
from engine.driver.nudger import Nudger
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.agent_message_routes import AgentMessageRoutes


class SendAgentMessageHandler(Handler[SendAgentMessage, Message]):
    """The one way to message an agent: checks that the caller may write to it, saves the message and gives the
    receiver a line naming it. An agent's own scope would hide a line it writes for another session."""

    command = SendAgentMessage
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository, nudger: Nudger, receivers: Receivers, agents: AgentRows, routes: AgentMessageRoutes, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.repository, self.nudger, self.receivers, self.agents, self.routes = repository, nudger, receivers, agents, routes

    def handle(self, command: SendAgentMessage, context: Context) -> Message:
        receiver = self.agents.find(command.recipient_agent_id)
        self.routes.check(context.actor, receiver)
        sender_id = context.actor.id if context.actor.type is ActorType.AGENT else None
        message = self.repository.save(Message(session_agent_id=sender_id, target_agent_id=None if receiver.role == AgentRole.MAIN else receiver.id, creator_id=context.actor.id,
                                               type=MessageType.AGENT, text=command.text, is_chat_visible=False), context)
        if command.notifies:
            self.nudger.send(self.receivers.message_receiver(command.recipient_agent_id).id, PARENT_REPORT, PARENT_REPORT_SOURCE, context, agent=self.numbers.number(AGENT_MODEL_NAME, context.actor.id), message=message.id)
        return message
