from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.agent_messages.agent_notice_message import AgentNoticeMessage
from engine.driver.message_sender import MessageSender


class RecordAgentNoticeHandler(Handler[RecordAgentNotice, None]):
    """Stores the notice and queues it, with its text, for the agent."""

    command = RecordAgentNotice

    def __init__(self, message_sender: MessageSender) -> None:
        self.message_sender = message_sender

    def handle(self, command: RecordAgentNotice, context: Context) -> None:
        self.message_sender.send(command.agent_id, AgentNoticeMessage.declared(), command.source, context, text=command.text)
