from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worktree_base.record_worktree_base import RecordWorktreeBase
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.behind_check_closing import BehindCheckClosing


class RecordWorktreeBaseHandler(Handler[RecordWorktreeBase, Worktree]):
    """Moves a worktree's row to the base commit its commit stood on and records the tasks that commit took,
    after git has committed its work; the commit stands on the base, so a check of the worktree closes as brought up to
    date, a clashing one too, since a commit carries only settled files."""

    command = RecordWorktreeBase
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository, closing: BehindCheckClosing) -> None:
        self.rows, self.repository, self.closing = rows, repository, closing

    def handle(self, command: RecordWorktreeBase, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        committed = self.repository.save_change(worktree, worktree.committed(command.base_commit, command.task_ids, command.short_id), context)
        self.closing.close_updated(committed, context)
        return committed
