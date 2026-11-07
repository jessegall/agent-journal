from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.support.nudger import Nudger


class RecordAgentNoticeHandler(Handler[RecordAgentNotice, None]):
    """Stores the notice and queues its row number for the agent."""

    command = RecordAgentNotice

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: RecordAgentNotice, context: Context) -> None:
        self.nudger.send_text(command.agent_id, command.text, command.source, context)
