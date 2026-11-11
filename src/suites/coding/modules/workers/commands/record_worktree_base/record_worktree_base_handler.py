from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worktree_base.record_worktree_base import RecordWorktreeBase
from suites.coding.modules.workers.models.worktree import Worktree


class RecordWorktreeBaseHandler(Handler[RecordWorktreeBase, Worktree]):
    """Moves a worktree's row to the base commit its commit stood on and records the tasks that commit took,
    after git has committed its work."""

    command = RecordWorktreeBase
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordWorktreeBase, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        return self.repository.save_change(worktree, worktree.committed(command.base_commit, command.task_ids, command.short_id), context)
