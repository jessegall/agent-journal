from engine.query.conditions.among import Among
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach

PASSED_TEXT = "checkpoint of phase {phase} passed on your commit {commit}"


class WorktreeRuns:
    """Reads the worker runs of a worktree: which checkpoints passed on which of its commits, and whether the
    newest run of a checkpoint still goes or failed, which keeps the worktree from its merge."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def passed_text(self, worktree_id: int) -> str:
        links = self.links(worktree_id)
        if not links:
            return ""
        passed_ids = {reach.id for reach in self.reaches(links) if reach.state is CheckpointState.PASSED}
        return "; ".join(PASSED_TEXT.format(phase=link.phase_id, commit=link.commit_id) for link in links if link.reach_id in passed_ids)

    def passed_commits(self, worktree_id: int) -> dict[int, str]:
        links = self.links(worktree_id)
        passed_ids = {reach.id for reach in self.reaches(links) if reach.state is CheckpointState.PASSED}
        return {link.phase_id: link.commit_id for link in links if link.reach_id in passed_ids}

    def holds_merge(self, worktree_id: int) -> bool:
        return self.blocking_run(worktree_id) is not None

    def blocking_run(self, worktree_id: int) -> tuple[WorktreeReach, CheckpointReach] | None:
        links = {link.reach_id: link for link in self.links(worktree_id)}
        newest = {reach.phase_id: reach for reach in sorted(self.reaches(tuple(links.values())), key=lambda reach: reach.id)}
        return next(((links[reach.id], reach) for reach in newest.values() if reach.state is not CheckpointState.PASSED), None)

    def links(self, worktree_id: int) -> tuple[WorktreeReach, ...]:
        reaches = self.queries.query(WorktreeReach).filter(worktree_id=worktree_id)
        return self.kept.read(reaches, lambda: tuple(reaches.get()), name="workers.worktree_reaches")

    def reaches(self, links: tuple[WorktreeReach, ...]) -> tuple[CheckpointReach, ...]:
        if not links:
            return ()
        reach_ids = tuple(link.reach_id for link in links)
        reaches = self.queries.query(CheckpointReach).matching(Among("id", reach_ids))
        return self.kept.read(reaches, lambda: tuple(reaches.get()), name="workers.worktree_run_reaches")
