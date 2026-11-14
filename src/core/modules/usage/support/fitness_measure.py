from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class FitnessMeasure:
    """One measure of how an agent works: its value, the level it should stay under, how close it is, from 0
    to 1, and its weight in the score; a weight of 0 is shown only."""

    key: str
    label: str
    value: float | None
    pass_level: float | None
    pass_share: float
    weight: int

    def json(self) -> Mapping[str, object]:
        return {"key": self.key, "label": self.label, "value": self.value, "pass_level": self.pass_level, "pass_share": self.pass_share, "weight": self.weight}
