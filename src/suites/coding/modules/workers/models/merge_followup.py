from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model

PENDING_STEP = "pending"
DONE_STEP = "done"
FAILED_STEP = "failed"
UNCERTAIN_STEP = "uncertain"


@dataclass(frozen=True, kw_only=True)
class MergeFollowup(EnvironmentScoped, Model):
    """The commands a merge must still run after git merged, saved as they were when the merge happened: the
    ordered commands, the revision of the setting they came from, the folder, the branch and the commits
    before and after, with the result of each step. A later edit of the setting never changes them."""

    model_name = "merge_followup"
    cli_name = "merge-followup"

    environment_id: int = 0
    worktree_id: int
    worker_id: int
    creator_id: int
    folder: str
    target_branch: str
    commit_before: str
    commit_after: str
    revision: str
    commands: tuple[str, ...]
    results: tuple[str, ...]

    @property
    def finished(self) -> bool:
        return all(result == DONE_STEP for result in self.results)
