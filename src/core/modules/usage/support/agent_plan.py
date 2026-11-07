from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class AgentPlan:
    """The plan of the task an agent holds: how far it is and which phase it is in."""

    plan_id: int
    title: str
    phase: int
    completed: int
    total: int

    def json(self) -> Mapping[str, object]:
        return {"id": self.plan_id, "title": self.title, "phase": self.phase, "done": self.completed, "total": self.total}
