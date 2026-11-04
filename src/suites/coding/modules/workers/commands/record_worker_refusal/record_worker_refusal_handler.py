from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worker_refusal.record_worker_refusal import RecordWorkerRefusal
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_refusals import WorkerRefusals


class RecordWorkerRefusalHandler(Handler[RecordWorkerRefusal, None]):
    command = RecordWorkerRefusal
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, refusals: WorkerRefusals) -> None:
        self.worktrees, self.refusals = worktrees, refusals

    def handle(self, command: RecordWorkerRefusal, context: Context) -> None:
        self.refusals.record(self.worktrees.find(command.worktree_id), context)
