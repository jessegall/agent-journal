from collections.abc import Mapping
from dataclasses import dataclass

from engine.driver.rule_answer import RuleAnswer
from engine.driver.stop_check import StopCheck


@dataclass(frozen=True)
class RuleRecord:
    """One rule on a hook: the layer it was asked for, and what it answered, that it raised, or that it was
    silenced."""

    name: str
    layer: str
    outcome: str
    answer: RuleAnswer | None = None
    history: bool = False
    applied: bool = True
    reason: str = ""
    milliseconds: int = 0

    @property
    def saved_fields(self) -> Mapping[str, object]:
        fields = {"rule": self.name, "outcome": self.outcome, "safety": True if self.answer is not None and self.answer.is_safety_refusal else None,
                  "layer": self.layer if self.layer else None,
                  "dropped_lines": self.answer.dropped_lines if self.answer is not None and self.answer.dropped_lines else None,
                  "milliseconds": self.milliseconds or None}
        return {key: value for key, value in fields.items() if value is not None}

    @property
    def stop_check(self) -> StopCheck:
        reason = self.reason or f"the rule was {self.outcome}"
        if self.answer is not None:
            reason = self.answer.refusal or self.answer.reason or self.reason or "; ".join(self.answer.lines) or "the rule found no reason to refuse"
        return StopCheck(self.name, self.outcome, reason, self.applied and self.answer is not None,
                         self.layer if self.layer else None)
