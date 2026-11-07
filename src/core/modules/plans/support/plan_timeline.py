from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.support.plan_event import PlanEvent


@dataclass(frozen=True)
class PlanTimeline:
    """One page of what happened on a plan's tasks, newest first, and how many events the plan has in all."""

    plan_id: int
    events: tuple[PlanEvent, ...]
    total: int = 0

    def json(self) -> Mapping[str, object]:
        return {"plan_id": self.plan_id, "events": [event.json() for event in self.events], "total": self.total}
