from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class CheckpointReview(EnvironmentScoped, Model):
    """The review a checkpoint started when its tests passed: a read-only reviewer agent, the program and the model
    it was started on, and what it was asked to compare."""

    model_name = "checkpoint_review"
    cli_name = "checkpoint-review"

    environment_id: int = 0
    creator_id: int
    plan_id: int
    phase_id: int
    reviewer_id: int
    program: str
    program_model: str
    brief: str
