from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach

PASSED_TEXT = "checkpoint of phase {phase} passed on your commit {commit}"


class WorktreeRuns:
    """Reads the worker runs of a worktree: which checkpoints passed on which of its commits."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def passed_text(self, worktree_id: int) -> str:
        links = tuple(self.queries.query(WorktreeReach).filter(worktree_id=worktree_id).all_rows())
        if not links:
            return ""
        passed_ids = {reach.id for reach in self.queries.query(CheckpointReach).matching(Among("id", tuple(link.reach_id for link in links))).filter(state=CheckpointState.PASSED).all_rows()}
        return "; ".join(PASSED_TEXT.format(phase=link.phase_id, commit=link.commit_id) for link in links if link.reach_id in passed_ids)
