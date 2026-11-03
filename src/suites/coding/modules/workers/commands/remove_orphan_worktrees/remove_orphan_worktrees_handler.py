from pathlib import Path

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.modules.environments.models.environment import Environment
from core.base.query.queries import Queries
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker_handler import WORKTREES_FOLDER
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees import RemoveOrphanWorktrees
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class RemoveOrphanWorktreesHandler(Handler[RemoveOrphanWorktrees, tuple[str, ...]]):
    """Removes each worktree git knows under the environment's worktree folder that has no worker row left,
    after keeping its tip as a ref under refs/worker-tips, so its commits stay reachable; one a worker holds
    stays, and so does one with changes not committed, which git refuses to remove."""

    command = RemoveOrphanWorktrees
    transactional = False

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, git: WorktreeGit) -> None:
        self.queries, self.worktrees, self.git = queries, worktrees, git

    def handle(self, command: RemoveOrphanWorktrees, context: Context) -> tuple[str, ...]:
        environment = self.queries.query(Environment).find(command.environment_id)
        occupied = {str(Path(row.folder).resolve()) for row in self.worktrees.matching(IsNull("removed_at")).all_rows()}
        root = (Path(environment.folder) / WORKTREES_FOLDER).resolve()
        orphans = [folder for folder, _ in self.git.folders(environment.folder) if Path(folder).resolve().is_relative_to(root) and str(Path(folder).resolve()) not in occupied]
        for folder in orphans:
            self.git.keep_tip(environment.folder, folder, Path(folder).name)
            self.git.remove_orphan(environment.folder, folder)
        return tuple(orphans)
