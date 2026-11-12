from dataclasses import dataclass

from core.modules.plans.support.outline_task import OutlineTask
from core.modules.plans.support.plan_phase_json_record import PlanPhaseJsonRecord
from core.modules.plans.support.plan_phase_task_json_record import PlanPhaseTaskJsonRecord


@dataclass(frozen=True)
class OutlinePhase:
    """A phase as a plan's outline shows it, with its tasks in order."""

    id: int
    title: str
    goal: str
    tasks: tuple[OutlineTask, ...]
    checkpoint: bool = False

    def finished(self) -> bool:
        return all(task.is_closed() for task in self.tasks)

    def json(self) -> PlanPhaseJsonRecord:
        return {"id": self.id, "title": self.title, "goal": self.goal, "checkpoint": self.checkpoint, "tasks": [self.task_json(task) for task in self.tasks]}

    @staticmethod
    def task_json(task: OutlineTask) -> PlanPhaseTaskJsonRecord:
        return {"id": task.id, "title": task.title, "state": task.state, "priority": task.priority, "complexity": task.complexity, "tags": list(task.tags), "reason": task.reason, "automatic": task.automatic,
                "assigned_actor_id": task.delegated_to, "is_main_assignee": task.main_delegate, "helper_id": task.helper_id, "helper_name": task.helper_name, "helper_main": task.helper_main}
