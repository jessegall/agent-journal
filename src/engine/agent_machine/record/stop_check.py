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
