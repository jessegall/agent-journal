from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.nudges.agent_notice_message import AgentNoticeMessage
from engine.driver.nudger import MessageSender


class RecordAgentNoticeHandler(Handler[RecordAgentNotice, None]):
    """Stores the notice and queues it, with its text, for the agent."""

    command = RecordAgentNotice

    def __init__(self, nudger: MessageSender) -> None:
        self.nudger = nudger

    def handle(self, command: RecordAgentNotice, context: Context) -> None:
        self.nudger.send(command.agent_id, AgentNoticeMessage.declared(), command.source, context, text=command.text)
