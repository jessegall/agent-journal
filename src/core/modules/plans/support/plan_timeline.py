from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.support.plan_event import PlanEvent


@dataclass(frozen=True)
class PlanTimeline:
    """What happened on a plan's tasks, newest first."""

    plan_id: int
    events: tuple[PlanEvent, ...]

    def json(self) -> Mapping[str, object]:
        return {"plan_id": self.plan_id, "events": [event.json() for event in self.events]}
