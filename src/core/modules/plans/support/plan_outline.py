from dataclasses import dataclass

from engine.errors.refusal import Refusal
from core.modules.plans.support.outline_phase import OutlinePhase
from core.modules.plans.support.plan_agent import PlanAgent
from core.modules.plans.support.plan_outline_json_record import PlanOutlineJsonRecord


@dataclass(frozen=True)
class PlanOutline:
    """A plan's phases and tasks in order, holding only what a window draws of them."""

    plan_id: int
    phases: tuple[OutlinePhase, ...]

    def chosen(self, phase_id: int | None) -> tuple[OutlinePhase, ...]:
        if phase_id is None:
            return self.phases
        phases = tuple(phase for phase in self.phases if phase.id == phase_id)
        if not phases:
            raise Refusal(f"phase {phase_id} is not in plan {self.plan_id}", f"journal plan outline {self.plan_id} lists its phases")
        return phases

    def agents(self) -> tuple[PlanAgent, ...]:
        return tuple(PlanAgent(task.helper_id, task.helper_name, task.helper_main, task.id, task.title) for phase in self.phases for task in phase.tasks
                     if task.helper_id is not None and task.helper_name is not None and not task.is_closed())

    def json(self) -> PlanOutlineJsonRecord:
        agents = self.agents()
        return {"plan_id": self.plan_id, "delegated": bool(agents), "agents": [agent.json() for agent in agents], "phases": [phase.json() for phase in self.phases]}
