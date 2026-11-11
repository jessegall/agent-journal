from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.send_merged_worker_line.send_merged_worker_line import SendMergedWorkerLine
from suites.coding.modules.workers.support.merger_nudges import UNIT_MERGED, WORKER_MERGED
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from engine.query.queries import Queries


class SendMergedWorkerLineHandler(Handler[SendMergedWorkerLine, None]):
    command = SendMergedWorkerLine

    def __init__(self, main_line: MainAgentLine, numbers: RowNumbers, queries: Queries) -> None:
        self.numbers, self.queries = numbers, queries
        self.main_line = main_line

    def handle(self, command: SendMergedWorkerLine, context: Context) -> None:
        worker = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
        merged_ask = self.queries.query(MergeAsk).filter(worktree_id=command.worktree_id, state=MergeAskState.MERGED).newest().first()
        if merged_ask is None:
            self.main_line.send_nudge(WORKER_MERGED.nudge(worker=worker), WORKER_MERGED.key, context)
            return
        self.main_line.send_nudge(UNIT_MERGED.nudge(worker=worker, count=len(merged_ask.tasks()), merge_ask=merged_ask.id), UNIT_MERGED.key, context)
