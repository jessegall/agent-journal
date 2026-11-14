from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class BoardCondition:
    """One condition of a rule as the Assign tab shows it: its parts and the plain words for it."""

    field: str
    operator: str
    value: str
    label: str

    def json(self) -> Mapping[str, object]:
        return {"field": self.field, "operator": self.operator, "value": self.value, "label": self.label}
