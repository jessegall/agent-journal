from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.drivers.commands.record_agent_nudge.record_agent_nudge import RecordAgentNudge
from core.modules.drivers.support.nudger import Nudger


class RecordAgentNudgeHandler(Handler[RecordAgentNudge, None]):
    command = RecordAgentNudge

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: RecordAgentNudge, context: Context) -> None:
        self.nudger.send_nudge(command.agent_id, command.nudge, command.source, context)
