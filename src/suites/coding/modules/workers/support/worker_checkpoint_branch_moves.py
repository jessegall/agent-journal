from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.support.checkpoint_branch_moves import CheckpointBranchMoves
from engine.query.queries import Queries
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.checkpoint_folders import CheckpointFolders
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerCheckpointBranchMoves(CheckpointBranchMoves):
    """The branch moved after a worker run when the branch's head before the merge is not in the commit the
    run tested."""

    def __init__(self, folders: CheckpointFolders, queries: Queries, git: WorktreeGit, environments: EnvironmentRows) -> None:
        self.folders, self.queries, self.git, self.environments = folders, queries, git, environments

    def moved_after(self, reach: CheckpointReach) -> bool:
        link = self.folders.link(reach)
        if link is None:
            return True
        worktree = self.queries.query(Worktree).find(link.worktree_id)
        if not worktree.commit_before_merge:
            return True
        return not self.git.is_ancestor(self.environments.find(reach.environment_id).folder, worktree.commit_before_merge, link.commit_id)
