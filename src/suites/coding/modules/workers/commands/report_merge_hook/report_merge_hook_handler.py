from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.report_merge_hook.report_merge_hook import ReportMergeHook
from suites.coding.modules.workers.nudges.merge_hook_failed_message import MergeHookFailedMessage


class ReportMergeHookHandler(Handler[ReportMergeHook, None]):
    command = ReportMergeHook

    def __init__(self, main_line: MainAgentLine, numbers: RowNumbers) -> None:
        self.main_line, self.numbers = main_line, numbers

    def handle(self, command: ReportMergeHook, context: Context) -> None:
        worker = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
        self.main_line.send_nudge(MergeHookFailedMessage.declared().nudge(command=command.command, worker=worker), MergeHookFailedMessage.declared().key, context)
