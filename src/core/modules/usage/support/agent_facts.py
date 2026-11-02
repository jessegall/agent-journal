from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class AgentFacts:
    """What an agent's row in the agents window says beyond the row itself: its model, its context in use, what
    its session cost so far and the task it works on."""

    agent_id: int
    model: str
    context_percent: int | None
    cost_dollars: float
    task_id: int | None
    task_title: str
    delegated: tuple[Mapping[str, object], ...] = ()

    def json(self) -> Mapping[str, object]:
        return {"id": self.agent_id, "model": self.model, "context_percent": self.context_percent, "cost_dollars": self.cost_dollars, "task_id": self.task_id, "task_title": self.task_title, "delegated": list(self.delegated)}
