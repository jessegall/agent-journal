from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_failed_update.record_failed_update import RecordFailedUpdate
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.behind_check_closing import BehindCheckClosing
from suites.coding.modules.workers.support.behind_nudges import BEHIND_SOURCE, MERGER_UPDATE_FAILED
from suites.coding.modules.workers.support.merger_inbox import MergerInbox


class RecordFailedUpdateHandler(Handler[RecordFailedUpdate, None]):
    """Notes a failed update on the checks it was meant to settle, which stay open, and leaves the merger one
    line with the worker and the reason, the stash the changes wait in included, so it can advise or pass the
    worker on."""

    command = RecordFailedUpdate
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, closing: BehindCheckClosing, inbox: MergerInbox, numbers: RowNumbers) -> None:
        self.worktrees, self.closing, self.inbox, self.numbers = worktrees, closing, inbox, numbers

    def handle(self, command: RecordFailedUpdate, context: Context) -> None:
        worktree = self.worktrees.required_worker_worktree(command.worker_id)
        failed = self.closing.failed(worktree, command.reason, context)
        if not failed:
            return
        worker = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
        self.inbox.send_nudge(MERGER_UPDATE_FAILED.nudge(worker=worker, check=max(check.id for check in failed)), BEHIND_SOURCE, context)
