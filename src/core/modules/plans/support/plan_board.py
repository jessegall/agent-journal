from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.models.plan_card import PlanCard


@dataclass(frozen=True)
class PlanBoard:
    """What the plans window draws: how many plans are open and closed, and the page of cards of the side asked for."""

    open_total: int
    closed_total: int
    plans: tuple[PlanCard, ...]

    def json(self) -> Mapping[str, object]:
        return {"open_total": self.open_total, "closed_total": self.closed_total,
                "plans": [{"id": plan.id, "title": plan.title, "state": plan.state.value, "task_count": plan.task_count, "completed_count": plan.completed_count, "current_phase": plan.current_phase}
                          for plan in self.plans]}
