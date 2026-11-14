from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.helpers.commands.send_program_fault.send_program_fault import SendProgramFault
from core.modules.helpers.support.helper_nudges import HELPER_PROGRAM_FAULT


class SendProgramFaultHandler(Handler[SendProgramFault, None]):
    """Tells the main agent when a helper program exits with an error."""

    command = SendProgramFault

    def __init__(self, main_line: MainAgentLine, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.main_line = main_line

    def handle(self, command: SendProgramFault, context: Context) -> None:
        line = HELPER_PROGRAM_FAULT.nudge(agent=self.numbers.number(AGENT_MODEL_NAME, command.agent_id), code=command.exit_code)
        self.main_line.send(line.text, HELPER_PROGRAM_FAULT.key, context)
