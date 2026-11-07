from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.helpers.commands.report_program_fault.report_program_fault import ReportProgramFault
from core.modules.helpers.support.helper_nudges import HELPER_PROGRAM_FAULT


class ReportProgramFaultHandler(Handler[ReportProgramFault, None]):
    """Tells the main agent when a helper program exits with an error."""

    command = ReportProgramFault

    def __init__(self, main_line: MainAgentLine) -> None:
        self.main_line = main_line

    def handle(self, command: ReportProgramFault, context: Context) -> None:
        line = HELPER_PROGRAM_FAULT.nudge(agent=command.agent_id, code=command.exit_code)
        self.main_line.send(line.text, HELPER_PROGRAM_FAULT.key, context)
