from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_agent_nudge.record_agent_message import RecordAgentMessage
from engine.driver.nudger import MessageSender


class RecordAgentMessageHandler(Handler[RecordAgentMessage, None]):
    command = RecordAgentMessage

    def __init__(self, nudger: MessageSender) -> None:
        self.nudger = nudger

    def handle(self, command: RecordAgentMessage, context: Context) -> None:
        self.nudger.send_nudge(command.agent_id, command.nudge, command.source, context)
