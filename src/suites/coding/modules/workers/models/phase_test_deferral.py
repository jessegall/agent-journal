from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp

PATH_SEPARATOR = " "


@dataclass(frozen=True, kw_only=True)
class PhaseTestDeferral(EnvironmentScoped, Model):
    """Test paths a merger left out of the own test of a checkpoint phase until the next checkpoint of the
    plan: the run of the due phase adds them to its own test and closes the deferral, so no test is left out
    for good."""

    model_name = "phase_test_deferral"
    cli_name = "phase-test-deferral"

    environment_id: int = 0
    creator_id: int
    phase_id: int
    due_phase_id: int
    paths: str
    worker_id: int
    reason: str
    closed_at: Timestamp | None = None

    def path_words(self) -> tuple[str, ...]:
        return tuple(path for path in self.paths.split(PATH_SEPARATOR) if path)
