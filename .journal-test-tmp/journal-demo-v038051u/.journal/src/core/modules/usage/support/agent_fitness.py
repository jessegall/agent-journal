from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.usage.support.fitness_measure import FitnessMeasure


@dataclass(frozen=True)
class AgentFitness:
    """How an agent is working: a score out of 100 from its measures, not measured in its first half hour,
    and the load of messages reaching it against those it clears."""

    agent_id: int
    is_measured: bool
    score: int | None
    measures: Sequence[FitnessMeasure]
    workload: float
    workload_level: str
    arrivals_hourly: float
    answers_hourly: float
    waiting_messages: int

    def json(self) -> Mapping[str, object]:
        return {"agent_id": self.agent_id, "is_measured": self.is_measured, "score": self.score, "measures": [measure.json() for measure in self.measures], "workload": self.workload, "workload_level": self.workload_level, "arrivals_hourly": self.arrivals_hourly, "answers_hourly": self.answers_hourly, "waiting_messages": self.waiting_messages}
