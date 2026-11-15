from collections.abc import Mapping
from dataclasses import dataclass

from engine.driver.rule_answer import RuleAnswer


@dataclass(frozen=True)
class RuleRecord:
    """One source of a hook's answer: its name, its outcome and what it answered."""

    name: str
    outcome: str
    answer: RuleAnswer | None = None

    @property
    def saved_fields(self) -> Mapping[str, object]:
        fields = {"rule": self.name, "outcome": self.outcome, "safety": True if self.answer is not None and self.answer.is_safety_refusal else None,
                  "dropped_lines": self.answer.dropped_lines if self.answer is not None and self.answer.dropped_lines else None}
        return {key: value for key, value in fields.items() if value is not None}
