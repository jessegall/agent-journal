from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.send_merged_worker_line.send_merged_worker_line import SendMergedWorkerLine
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.nudges.unit_merged_nudge import UnitMergedNudge
from suites.coding.modules.workers.nudges.worker_merged_nudge import WorkerMergedNudge
from suites.coding.modules.workers.nudges.worker_without_tasks_nudge import WorkerWithoutTasksNudge
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from engine.query.queries import Queries


class SendMergedWorkerLineHandler(Handler[SendMergedWorkerLine, None]):
    command = SendMergedWorkerLine

    def __init__(self, main_line: MainAgentLine, numbers: RowNumbers, queries: Queries, tasks: TaskQuery) -> None:
        self.numbers, self.queries, self.tasks = numbers, queries, tasks
        self.main_line = main_line

    def handle(self, command: SendMergedWorkerLine, context: Context) -> None:
        worker = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
        if not self.tasks.assigned_ready(command.worker_id) and not self.tasks.started_tasks(command.worker_id):
            self.main_line.send_nudge(WorkerWithoutTasksNudge.declared().nudge(worker=worker), WorkerWithoutTasksNudge.declared().key, context)
        merged_request = self.queries.query(MergeAsk).filter(worktree_id=command.worktree_id, state=MergeAskState.MERGED).newest().first()
        if merged_request is None:
            self.main_line.send_nudge(WorkerMergedNudge.declared().nudge(worker=worker), WorkerMergedNudge.declared().key, context)
            return
        self.main_line.send_nudge(UnitMergedNudge.declared().nudge(worker=worker, count=len(merged_request.tasks()), merge_ask=merged_request.id), UnitMergedNudge.declared().key, context)
