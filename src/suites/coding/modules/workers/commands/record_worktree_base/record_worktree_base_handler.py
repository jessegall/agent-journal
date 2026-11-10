from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worktree_base.record_worktree_base import RecordWorktreeBase
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree


class RecordWorktreeBaseHandler(Handler[RecordWorktreeBase, Worktree]):
    """Moves a worktree's row to the base commit its hand-in stood on, after git has committed its work."""

    command = RecordWorktreeBase
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordWorktreeBase, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        return self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, base_commit=command.base_commit), context)
