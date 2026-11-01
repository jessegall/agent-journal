from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class FitnessMeasure:
    """One measure of how an agent works: its value, the level it should stay under, how close it is, from 0 to 1, and its weight in the score; a weight of 0 is shown only."""

    key: str
    label: str
    value: float | None
    pass_level: float | None
    closeness: float
    weight: int

    def json(self) -> Mapping[str, object]:
        return {"key": self.key, "label": self.label, "value": self.value, "pass_level": self.pass_level, "closeness": self.closeness, "weight": self.weight}


@dataclass(frozen=True)
class AgentFitness:
    """How an agent is working: a score out of 100 from its measures, not measured in its first half hour, and the load of messages reaching it against those it clears."""

    agent_id: int
    is_measured: bool
    score: int | None
    measures: Sequence[FitnessMeasure]
    load: float
    load_level: str

    def json(self) -> Mapping[str, object]:
        return {"agent_id": self.agent_id, "is_measured": self.is_measured, "score": self.score, "measures": [measure.json() for measure in self.measures], "load": self.load, "load_level": self.load_level}
