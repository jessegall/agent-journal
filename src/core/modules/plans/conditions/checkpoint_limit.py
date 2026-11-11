from dataclasses import dataclass

from engine.database.statement import Statement

CHECKPOINT_LIMIT = ("phase_position <= coalesce((SELECT min(checkpoints.phase_position) FROM plan_tasks AS checkpoints"
                    " WHERE checkpoints.plan_id = ? AND checkpoints.checkpoint = 1"
                    " AND (checkpoints.closed_at IS NULL OR checkpoints.checkpoint_passed = 0)), phase_position)")


@dataclass(frozen=True)
class CheckpointLimit:
    """Matches a plan's places up to its first checkpoint phase that still has an open task or whose tests
    have not passed, so no later phase is started on work that is not tested."""

    plan_id: int

    def statement(self) -> Statement:
        return Statement(CHECKPOINT_LIMIT, [self.plan_id])
