from dataclasses import dataclass

from core.modules.plans.support.outline_phase import OutlinePhase
from core.modules.plans.support.plan_agent import PlanAgent
from core.modules.plans.support.plan_outline_json_record import PlanOutlineJsonRecord


@dataclass(frozen=True)
class PlanOutline:
    """A plan's phases and tasks in order, holding only what a window draws of them."""

    plan_id: int
    phases: tuple[OutlinePhase, ...]

    def agents(self) -> tuple[PlanAgent, ...]:
        return tuple(PlanAgent(task.helper_id, task.helper_name, task.id, task.title) for phase in self.phases for task in phase.tasks
                     if task.helper_id is not None and task.helper_name is not None and not task.is_closed())

    def json(self) -> PlanOutlineJsonRecord:
        agents = self.agents()
        return {"plan_id": self.plan_id, "delegated": bool(agents), "agents": [agent.json() for agent in agents], "phases": [phase.json() for phase in self.phases]}
