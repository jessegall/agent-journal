from dataclasses import dataclass

from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.support.cadence_limits import CadenceLimits

GROWTHS_KEPT = 5
SPARSE_AFTER_SECONDS = 120


@dataclass(frozen=True)
class RunCadence:
    """How one run prints, judged from its age, the present time and the times its output last grew: often
    enough, nothing yet, nothing after it last printed, or too seldom for a reader to follow."""

    age: float
    clock_seconds: float
    growths: tuple[float, ...]
    limits: CadenceLimits

    def state(self) -> CadenceState:
        if self.age < self.limits.first_output_seconds:
            return CadenceState.STREAMING
        if not self.growths:
            return CadenceState.NO_OUTPUT
        if self.clock_seconds - self.growths[-1] >= self.limits.stopped_writing_seconds:
            return CadenceState.STOPPED_WRITING
        if self.age >= SPARSE_AFTER_SECONDS and self.average_pause() >= self.limits.sparse_seconds:
            return CadenceState.SPARSE
        return CadenceState.STREAMING

    def average_pause(self) -> float:
        kept = self.growths[-GROWTHS_KEPT:]
        if len(kept) < 2:
            return self.age / (len(kept) + 1)
        pauses = [max(0.0, later - prior) for prior, later in zip(kept, kept[1:])]
        return sum(pauses) / len(pauses)
