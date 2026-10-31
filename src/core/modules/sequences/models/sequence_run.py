from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class SequenceRun(Model):
    """One agent working through a sequence: the step it is on, whether it took that step up, and when the run ended."""

    model_name = "sequence_run"
    cli_name = "sequence-run"

    environment_id: int
    agent_id: int
    sequence_id: int
    step_number: int = 1
    step_started: bool = False
    ended_at: Timestamp | None = None
    outcome: str = ""
