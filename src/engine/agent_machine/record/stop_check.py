from collections.abc import Mapping
from dataclasses import dataclass

from engine.enums.decision_class import DecisionClass


@dataclass(frozen=True)
class StopCheck:
    """How one constraint, or the work answer, judged a stop: the constraint's key, its outcome, its reason
    and whether it applied."""

    rule: str
    outcome: DecisionClass
    reason_text: str
    applied: bool

    @property
    def is_refusal(self) -> bool:
        return self.outcome is not DecisionClass.ALLOW

    @property
    def refusal_text(self) -> str:
        return f"{self.rule} ({self.reason_text})"

    @property
    def saved_fields(self) -> Mapping[str, object]:
        return {"rule": self.rule, "outcome": "refused" if self.is_refusal else "allowed", "reason": self.reason_text, "applied": self.applied}
