from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_outline import PlanOutline



@dataclass(frozen=True)
class PlanInspection:
    """What the plan inspector draws: the plan, its phases and tasks, how far it has come and the phase it is
    in."""

    plan: Plan
    outline: PlanOutline

    def current_phase(self) -> int:
        if self.plan.state != PlanState.STARTED:
            return 0
        return next((number for number, phase in enumerate(self.outline.phases, 1) if not phase.finished()), 0)

    def json(self) -> Mapping[str, object]:
        tasks = [task for phase in self.outline.phases for task in phase.tasks]
        return {"id": self.plan.id, "title": self.plan.title, "brief": self.plan.brief, "state": self.plan.state.value, "reason": self.plan.reason,
                "total": len(tasks), "finished": sum(task.is_closed() for task in tasks), "current_phase": self.current_phase(),
                "phases": [phase.json() for phase in self.outline.phases]}
