from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.support.checkpoint_branch_moves import CheckpointBranchMoves
from engine.query.queries import Queries
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.checkpoint_folders import CheckpointFolders


class WorkerCheckpointBranchMoves(CheckpointBranchMoves):
    """The branch moved after a worker run unless its head before the merge was the base the worker's commit was
    made on, which the tested commit then holds. It is read from the rows, never from git, as a checkpoint's
    record asks it inside a write; any other head counts as moved, so the run is made again rather than skipped."""

    def __init__(self, folders: CheckpointFolders, queries: Queries) -> None:
        self.folders, self.queries = folders, queries

    def moved_after(self, reach: CheckpointReach) -> bool:
        link = self.folders.link(reach)
        if link is None:
            return True
        worktree = self.queries.query(Worktree).find(link.worktree_id)
        return not worktree.commit_before_merge or worktree.commit_before_merge != worktree.base_commit
