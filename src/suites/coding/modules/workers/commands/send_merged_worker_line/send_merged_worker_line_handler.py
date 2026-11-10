from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.send_merged_worker_line.send_merged_worker_line import SendMergedWorkerLine
from suites.coding.modules.workers.support.merger_nudges import WORKER_MERGED


class SendMergedWorkerLineHandler(Handler[SendMergedWorkerLine, None]):
    command = SendMergedWorkerLine

    def __init__(self, main_line: MainAgentLine) -> None:
        self.main_line = main_line

    def handle(self, command: SendMergedWorkerLine, context: Context) -> None:
        self.main_line.send_nudge(WORKER_MERGED.nudge(worker=command.worker_id), WORKER_MERGED.key, context)
