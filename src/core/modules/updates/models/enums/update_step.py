from enum import StrEnum

from engine.enums.mark_outcome import MarkOutcome

RUNNING_STEP_COUNT = 4


class UpdateStep(StrEnum):
    """Where `journal server update` stands: the new code is being proved, the running server hands over, the
    new server serves, then the update is finished or was refused."""

    PROOF = "proof"
    HANDOVER = "handover"
    SERVING = "serving"
    FINISHED = "finished"
    FAILED = "failed"

    @property
    def is_ended(self) -> bool:
        return self in (UpdateStep.FINISHED, UpdateStep.FAILED)

    @property
    def number(self) -> int:
        return list(UpdateStep).index(self) + 1

    @property
    def fraction(self) -> float:
        return 0.0 if self.is_ended else self.number / RUNNING_STEP_COUNT

    @property
    def figure(self) -> str:
        return "" if self.is_ended else f"step {self.number} of {RUNNING_STEP_COUNT}"

    @property
    def outcome(self) -> MarkOutcome:
        if self is UpdateStep.FINISHED:
            return MarkOutcome.PASSED
        return MarkOutcome.FAILED if self is UpdateStep.FAILED else MarkOutcome.RUNNING

    def text(self, version: str) -> str:
        if self is UpdateStep.PROOF:
            return "Updating the server: proving the new code"
        if self is UpdateStep.HANDOVER:
            return "Updating the server: the running server hands over"
        if self is UpdateStep.SERVING:
            return "Updating the server: the new server took over"
        return f"Server updated to {version}" if self is UpdateStep.FINISHED else "Server update refused"
