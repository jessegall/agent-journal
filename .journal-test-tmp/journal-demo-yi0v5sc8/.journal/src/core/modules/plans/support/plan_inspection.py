from core.modules.plans.support.plan_inspection_json_record import PlanInspectionJsonRecord
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

    def json(self) -> PlanInspectionJsonRecord:
        tasks = [task for phase in self.outline.phases for task in phase.tasks]
        agents = self.outline.agents()
        return {"id": self.plan.id, "title": self.plan.title, "brief": self.plan.brief, "state": self.plan.state.value, "reason": self.plan.reason,
                "total": len(tasks), "finished": sum(task.is_closed() for task in tasks), "current_phase": self.current_phase(), "document_id": self.plan.document_id,
                "delegated": bool(agents), "agents": [agent.json() for agent in agents], "phases": [phase.json() for phase in self.outline.phases]}
