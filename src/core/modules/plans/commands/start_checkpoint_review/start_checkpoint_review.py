from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plans.models.checkpoint_review import CheckpointReview


@dataclass(frozen=True)
class StartCheckpointReview(Command[CheckpointReview]):
    """Starts the read-only reviewer of a checkpoint whose tests passed, on the model the review-model
    setting names; its report goes to the main agent given."""

    plan_id: int
    phase_id: int
    main_id: int
