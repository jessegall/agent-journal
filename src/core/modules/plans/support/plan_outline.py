from collections.abc import Mapping
from core.modules.plans.support.outline_phase import OutlinePhase
from dataclasses import dataclass


@dataclass(frozen=True)
class PlanOutline:
    """A plan's phases and tasks in order, holding only what a window draws of them."""

    plan_id: int
    phases: tuple[OutlinePhase, ...]

    def json(self) -> Mapping[str, object]:
        return {"plan_id": self.plan_id, "phases": [phase.json() for phase in self.phases]}
