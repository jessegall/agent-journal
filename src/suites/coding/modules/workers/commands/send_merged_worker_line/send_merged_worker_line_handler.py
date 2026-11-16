from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.send_merged_worker_line.send_merged_worker_line import SendMergedWorkerLine
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.agent_messages.unit_merged_message import UnitMergedMessage
from suites.coding.modules.workers.agent_messages.worker_merged_message import WorkerMergedMessage
from suites.coding.modules.workers.agent_messages.taskless_worker_message import TasklessWorkerMessage
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from engine.query.queries import Queries


class SendMergedWorkerLineHandler(Handler[SendMergedWorkerLine, None]):
    command = SendMergedWorkerLine

    def __init__(self, main_line: MainAgentLine, numbers: RowNumbers, queries: Queries, tasks: TaskQuery) -> None:
        self.numbers, self.queries, self.tasks = numbers, queries, tasks
        self.main_line = main_line

    def handle(self, command: SendMergedWorkerLine, context: Context) -> None:
        worker = self.numbers.agent_number(command.worker_id)
        if not self.tasks.assigned_ready(command.worker_id) and not self.tasks.started_tasks(command.worker_id):
            self.main_line.send_agent_message(TasklessWorkerMessage.declared().agent_message(worker=worker), TasklessWorkerMessage.declared().key, context)
        merged_request = self.queries.query(MergeAsk).filter(worktree_id=command.worktree_id, state=MergeAskState.MERGED).newest().first()
        if merged_request is None:
            self.main_line.send_agent_message(WorkerMergedMessage.declared().agent_message(worker=worker), WorkerMergedMessage.declared().key, context)
            return
        self.main_line.send_agent_message(UnitMergedMessage.declared().agent_message(worker=worker, count=len(merged_request.tasks()), merge_ask=merged_request.id), UnitMergedMessage.declared().key, context)
