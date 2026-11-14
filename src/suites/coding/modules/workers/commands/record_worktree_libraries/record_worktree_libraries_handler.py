from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from suites.coding.modules.workers.commands.record_worktree_libraries.record_worktree_libraries import RecordWorktreeLibraries
from suites.coding.modules.workers.models.worktree import Worktree


class RecordWorktreeLibrariesHandler(Handler[RecordWorktreeLibraries, Worktree]):
    """Keeps when a worktree's copied libraries were removed, and none once they are back."""

    command = RecordWorktreeLibraries

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordWorktreeLibraries, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        return self.repository.save_change(worktree, worktree.change_libraries(context.timestamp if command.dropped else None), context)
