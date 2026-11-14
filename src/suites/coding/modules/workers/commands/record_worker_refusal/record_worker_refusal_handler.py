from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worker_refusal.record_worker_refusal import RecordWorkerRefusal
from engine.listener.rows.event_rows import EventRows
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_refusals import WorkerRefusals


class RecordWorkerRefusalHandler(Handler[RecordWorkerRefusal, None]):
    command = RecordWorkerRefusal
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, refusals: WorkerRefusals) -> None:
        self.rows, self.refusals = rows, refusals

    def handle(self, command: RecordWorkerRefusal, context: Context) -> None:
        self.refusals.record(self.rows.required(Worktree, command.worktree_id), context, command.refusal_text)
