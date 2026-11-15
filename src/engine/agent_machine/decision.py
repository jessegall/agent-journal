from dataclasses import dataclass

from engine.agent_stack.reason import Reason
from engine.enums.decision_class import DecisionClass


@dataclass(frozen=True)
class Decision:
    """Allow, hold, refuse or halt, with the reason that decided it."""

    decision_class: DecisionClass
    reason: Reason

    @classmethod
    def allowed(cls) -> "Decision":
        return cls(DecisionClass.ALLOW, Reason.allowed())

    def admits(self) -> bool:
        return self.decision_class is DecisionClass.ALLOW
