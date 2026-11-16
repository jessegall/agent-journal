from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.report_merge_hook.report_merge_hook import ReportMergeHook
from suites.coding.modules.workers.agent_messages.merge_hook_failed_message import MergeHookFailedMessage


class ReportMergeHookHandler(Handler[ReportMergeHook, None]):
    command = ReportMergeHook

    def __init__(self, main_line: MainAgentLine) -> None:
        self.main_line = main_line

    def handle(self, command: ReportMergeHook, context: Context) -> None:
        worker = command.worker_id
        self.main_line.send_agent_message(MergeHookFailedMessage.declared().agent_message(command=command.command, worker=worker), MergeHookFailedMessage.declared().key, context)
