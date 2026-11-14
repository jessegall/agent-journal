from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.assign_rules.support.condition_line import ConditionLine


@dataclass(frozen=True)
class ConditionResult:
    """One condition of a tried rule and whether the task meets it."""

    condition: ConditionLine
    matched: bool

    @property
    def line(self) -> str:
        return f"  {self.condition.text}: {'met' if self.matched else 'missed'}"

    def json(self) -> Mapping[str, object]:
        return {"field": self.condition.field.value, "operator": self.condition.operator.value, "value": self.condition.value, "label": self.condition.label, "matched": self.matched}
