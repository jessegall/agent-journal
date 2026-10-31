from dataclasses import dataclass

from core.base.database.statement import Statement

CHECKPOINT_LIMIT = ("phase_position <= coalesce((SELECT min(checkpoints.phase_position) FROM plan_tasks AS checkpoints"
                    " WHERE checkpoints.plan_id = ? AND checkpoints.checkpoint = 1 AND checkpoints.closed_at IS NULL), phase_position)")


@dataclass(frozen=True)
class CheckpointLimit:
    """Matches a plan's places up to its first checkpoint phase that still has an open task, so no later
    phase is started before the user has looked at that checkpoint's work."""

    plan_id: int

    def statement(self) -> Statement:
        return Statement(CHECKPOINT_LIMIT, [self.plan_id])
