from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_bypass_line.record_bypass_line import RecordBypassLine
from engine.model.model import Model
from core.modules.drivers.support.driver_nudges import HOOKS_UNCHECKED
from engine.driver.nudger import Nudger

LINE_SOURCE = "drivers.bypass"


class RecordBypassLineHandler(Handler[RecordBypassLine, Model]):
    """Saves the line, which waits for the agent's next hook."""

    command = RecordBypassLine

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: RecordBypassLine, context: Context) -> Model:
        return self.nudger.send(command.agent_id, HOOKS_UNCHECKED, LINE_SOURCE, context, count=command.count)
