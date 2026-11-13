from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.assign_rules.models.assign_decision import AssignDecision

NO_DECISION = "no decision yet"


@dataclass(frozen=True)
class TaskExplanation:
    """Why the rules did what they did about one task: the decision recorded last, and what the rules would do
    with it now; reading it changes nothing."""

    task_id: int
    decision: AssignDecision | None
    now: str

    @property
    def decided(self) -> str:
        return NO_DECISION if self.decision is None else f"{self.decision.outcome}: {self.decision.reason}"

    def lines(self) -> Sequence[str]:
        return [f"task {self.task_id}", f"decided: {self.decided}", f"now: {self.now}"]

    def json(self) -> Mapping[str, object]:
        return {"task_id": self.task_id, "decided": self.decided, "now": self.now}
