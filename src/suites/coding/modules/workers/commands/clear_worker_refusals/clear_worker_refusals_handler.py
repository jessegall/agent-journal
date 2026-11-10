from engine.command.context import Context
from engine.command.handler import Handler
from suites.coding.modules.workers.commands.clear_worker_refusals.clear_worker_refusals import ClearWorkerRefusals
from core.base.listener.event_rows import EventRows
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_refusals import WorkerRefusals


class ClearWorkerRefusalsHandler(Handler[ClearWorkerRefusals, None]):
    command = ClearWorkerRefusals

    def __init__(self, rows: EventRows, refusals: WorkerRefusals) -> None:
        self.rows, self.refusals = rows, refusals

    def handle(self, command: ClearWorkerRefusals, context: Context) -> None:
        self.refusals.clear(self.rows.required(Worktree, command.worktree_id), context)
