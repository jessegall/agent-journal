from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class SequenceRun(EnvironmentScoped, Model):
    """One agent working through a sequence: the step it is on, whether it took that step up, and when the run
    ended. A run a row started keeps that row's number as its subject."""

    model_name = "sequence_run"
    cli_name = "sequence-run"

    environment_id: int = 0
    session_agent_id: int
    sequence_id: int
    step_number: int = 1
    step_started: bool = False
    ended_at: Timestamp | None = None
    outcome: str = ""
    subject_id: int | None = None
