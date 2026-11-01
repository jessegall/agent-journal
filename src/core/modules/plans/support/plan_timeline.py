from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.support.plan_moment import PlanMoment


@dataclass(frozen=True)
class PlanTimeline:
    """What happened on a plan's tasks, newest first."""

    plan_id: int
    moments: tuple[PlanMoment, ...]

    def json(self) -> Mapping[str, object]:
        return {"plan_id": self.plan_id, "moments": [moment.json() for moment in self.moments]}
