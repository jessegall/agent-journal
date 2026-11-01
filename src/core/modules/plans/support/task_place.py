from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class TaskPlace:
    """Where a task stands in its plan: the plan, and which of its phases holds the task; a task in no plan
    has plan id 0."""

    plan_id: int = 0
    plan_title: str = ""
    phase_number: int = 0
    phase_total: int = 0
    phase_title: str = ""

    def json(self) -> Mapping[str, object]:
        return {"plan_id": self.plan_id, "plan_title": self.plan_title, "phase_number": self.phase_number, "phase_total": self.phase_total, "phase_title": self.phase_title}
