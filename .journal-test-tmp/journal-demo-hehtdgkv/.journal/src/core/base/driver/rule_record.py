from collections.abc import Mapping
from dataclasses import dataclass

from core.base.driver.rule_answer import RuleAnswer


@dataclass(frozen=True)
class RuleRecord:
    """One rule on a hook: the layer it was asked for, and what it answered, that it raised, or that it was
    silenced."""

    name: str
    layer: str
    outcome: str
    answer: RuleAnswer | None = None
    history: bool = False

    @property
    def saved_fields(self) -> Mapping[str, object]:
        fields = {"rule": self.name, "outcome": self.outcome,
                  "layer": self.layer if self.layer else None,
                  "dropped_lines": self.answer.dropped_lines if self.answer is not None and self.answer.dropped_lines else None}
        return {key: value for key, value in fields.items() if value is not None}
