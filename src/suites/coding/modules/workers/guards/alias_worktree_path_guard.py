from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.guard.guard import Guard
from core.modules.aliases.models.alias import Alias
from suites.coding.support.worktree_checkouts import WORKTREES_FOLDER


class AliasWorktreePathGuard(Guard[Created[Alias]]):
    """Refuses a saved command whose line holds a path into a worker's worktree, which is removed at its merge."""

    name = "workers.alias-worktree-path"

    def check(self, event: Created[Alias], context: Context) -> None:
        if f"{WORKTREES_FOLDER.as_posix()}/" in event.row.line:
            raise Refusal("a saved command cannot contain a temporary worktree path", "write the line from the project's folder, with no path into a worktree")
