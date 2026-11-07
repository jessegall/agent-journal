from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.nudge import Nudge
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_PASSED, MERGER_PROFILE, MERGER_SOURCE, NO_WORKER_WAITING
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport


class SendMergerReportHandler(Handler[SendMergerReport, None]):
    """Sends the main agent a line of the merger."""

    command = SendMergerReport

    def __init__(self, main_line: MainAgentLine) -> None:
        self.main_line = main_line

    def handle(self, command: SendMergerReport, context: Context) -> None:
        if isinstance(command.text, Nudge):
            self.main_line.send_nudge(command.text, MERGER_SOURCE, context)
            return
        self.main_line.send(command.text, MERGER_SOURCE, context)
