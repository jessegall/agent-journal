from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorktreeRowsListener(SaveListener[Changed[Worktree]]):
    name = "workers.worktree-rows"

    def __init__(self, worktrees: WorktreeQuery) -> None:
        self.worktrees = worktrees

    def handle(self, event: Changed[Worktree], context: Context) -> None:
        if isinstance(event, Deleted):
            self.worktrees.remove(event.row)
            return
        self.worktrees.remember(event.row)
