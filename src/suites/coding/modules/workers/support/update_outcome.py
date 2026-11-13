from dataclasses import dataclass

from suites.coding.modules.workers.models.enums.update_result import UpdateResult
from suites.coding.modules.workers.support.worktree_update import WorktreeUpdate


@dataclass(frozen=True)
class UpdateOutcome:
    """What a worker is told when its update ends: where its worktree now stands, or what it settles first."""

    base_branch: str
    update: WorktreeUpdate
    outcome: UpdateResult

    def lines(self) -> list[str]:
        if self.outcome is UpdateResult.CURRENT:
            return [f"already up to date with {self.base_branch}"]
        if self.outcome is UpdateResult.UPDATED:
            return [f"Your worktree is on {self.base_branch} at {self.update.base_commit[:10]}. Go on."]
        lines = [f"The update clashes with {self.base_branch} in {', '.join(self.update.conflicts)}: settle the markers, then go on. Your next commit carries the settled files."]
        if self.update.stash_id:
            lines.append(f"Your uncommitted changes stay in stash {self.update.stash_id} until your next commit puts them back on the settled merge.")
        return lines
