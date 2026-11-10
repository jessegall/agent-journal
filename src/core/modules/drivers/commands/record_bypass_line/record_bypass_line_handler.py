from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_bypass_line.record_bypass_line import RecordBypassLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.driver_nudges import HOOKS_UNCHECKED
from core.modules.drivers.support.nudger import Nudger

LINE_SOURCE = "drivers.bypass"


class RecordBypassLineHandler(Handler[RecordBypassLine, AgentLine]):
    """Saves the line, which waits for the agent's next hook."""

    command = RecordBypassLine

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: RecordBypassLine, context: Context) -> AgentLine:
        return self.nudger.send(command.agent_id, HOOKS_UNCHECKED, LINE_SOURCE, context, count=command.count)
