from dataclasses import dataclass

from engine.agent_stack.reason import Reason
from engine.agent_stack.work_reference import WorkReference
from engine.enums.stop_answer_type import StopAnswerType


@dataclass(frozen=True)
class StopAnswer:
    """How an agent's stack answers a stop: allowed, refused with its reasons, a hand-in of its work,
    a safety rest under Paused or the compaction handoff."""

    answer_type: StopAnswerType
    reasons: tuple[Reason, ...] = ()
    work: WorkReference | None = None

    @classmethod
    def allowed(cls) -> "StopAnswer":
        return cls(StopAnswerType.ALLOWED)

    @classmethod
    def refusal(cls, reason: Reason) -> "StopAnswer":
        return cls(StopAnswerType.REFUSED, (reason,))

    @classmethod
    def refusals(cls, reasons: "list[Reason]") -> "StopAnswer":
        return cls(StopAnswerType.REFUSED, tuple(reasons))

    @classmethod
    def job_report(cls, work: WorkReference) -> "StopAnswer":
        return cls(StopAnswerType.JOB_REPORT, work=work)

    @classmethod
    def safety_rest(cls) -> "StopAnswer":
        return cls(StopAnswerType.SAFETY_PAUSE)

    @classmethod
    def compaction_handoff(cls) -> "StopAnswer":
        return cls(StopAnswerType.COMPACTION_HANDOFF)

    def refusal_reasons(self) -> tuple[Reason, ...]:
        return self.reasons
