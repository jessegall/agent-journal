from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_agent_agent_message.record_agent_message import RecordAgentMessage
from engine.driver.message_sender import MessageSender


class RecordAgentMessageHandler(Handler[RecordAgentMessage, None]):
    command = RecordAgentMessage

    def __init__(self, message_sender: MessageSender) -> None:
        self.message_sender = message_sender

    def handle(self, command: RecordAgentMessage, context: Context) -> None:
        self.message_sender.send_agent_message(command.agent_id, command.agent_message, command.source, context)
