from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class CheckpointPass(EnvironmentScoped, Model):
    """A checkpoint of a plan whose tests passed: the phases after it are open from then on."""

    model_name = "checkpoint_pass"
    cli_name = "checkpoint-pass"

    environment_id: int = 0
    creator_id: int
    plan_id: int
    phase_id: int
    passed_at: Timestamp
