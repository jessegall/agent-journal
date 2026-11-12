from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.behind_check_closing import BehindCheckClosing


class BehindCheckGoneListener(SaveListener[Moved[Worktree]]):
    """Closes the checks of a worktree that left its cut state as gone, so no order to update waits for anyone."""

    name = "workers.behind-check-gone"
    moves = (WorktreeLifecycle.deliver, WorktreeLifecycle.merge, WorktreeLifecycle.fail, WorktreeLifecycle.abandon, WorktreeLifecycle.remove)
    disabled_scopes = [ActorScope]

    def __init__(self, closing: BehindCheckClosing) -> None:
        self.closing = closing

    def handle(self, event: Moved[Worktree], context: Context) -> None:
        self.closing.close_gone(event.row, context)
