from pathlib import Path

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.modules.environments.models.environment import Environment
from core.base.query.queries import Queries
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree_handler import WORKTREES_FOLDER
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees import RemoveOrphanWorktrees
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class RemoveOrphanWorktreesHandler(Handler[RemoveOrphanWorktrees, tuple[str, ...]]):
    """Removes only unoccupied worktrees merged into their own environment's branch."""

    command = RemoveOrphanWorktrees

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, git: WorktreeGit) -> None:
        self.queries, self.worktrees, self.git = queries, worktrees, git

    def handle(self, command: RemoveOrphanWorktrees, context: Context) -> tuple[str, ...]:
        environment = self.queries.query(Environment).find(context.environment_id)
        occupied = {str(Path(row.folder).resolve()) for row in self.worktrees.matching(IsNull("removed_at")).all_rows()}
        root = (Path(environment.folder) / WORKTREES_FOLDER).resolve()
        orphans: list[tuple[str, str | None]] = []
        for folder, branch in self.git.folders(environment.folder):
            path = Path(folder).resolve()
            environment_match = path.is_relative_to(root) and path.parent == root / environment.name
            if not environment_match:
                continue
            if str(path) in occupied:
                continue
            orphans.append((folder, branch))
        for folder, _ in orphans:
            self.git.keep_tip(environment.folder, folder, Path(folder).name)
        return tuple(folder for folder, branch in orphans if self.git.remove_orphan(environment.folder, folder, environment.branch, branch))
