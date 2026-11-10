from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal import RecordWorktreeRemoval
from suites.coding.modules.workers.models.worktree import Worktree


class RecordWorktreeRemovalHandler(Handler[RecordWorktreeRemoval, Worktree]):
    """Moves a merged or abandoned worktree's row to removed once git has taken its folder away."""

    command = RecordWorktreeRemoval
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordWorktreeRemoval, context: Context) -> Worktree:
        merged = self.rows.required(Worktree, command.worktree_id)
        return self.repository.save_change(merged, merged.remove(context.timestamp, context.actor), context)
