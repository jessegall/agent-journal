from core.base.command.context import Context
from core.base.command.handler import Handler
from suites.coding.modules.workers.commands.clear_worker_refusals.clear_worker_refusals import ClearWorkerRefusals
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_refusals import WorkerRefusals


class ClearWorkerRefusalsHandler(Handler[ClearWorkerRefusals, None]):
    command = ClearWorkerRefusals

    def __init__(self, worktrees: WorktreeQuery, refusals: WorkerRefusals) -> None:
        self.worktrees, self.refusals = worktrees, refusals

    def handle(self, command: ClearWorkerRefusals, context: Context) -> None:
        self.refusals.clear(self.worktrees.find(command.worktree_id), context)
