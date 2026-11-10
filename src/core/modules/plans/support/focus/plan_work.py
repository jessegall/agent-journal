from dataclasses import dataclass

from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.focus.unblockers import Unblockers


@dataclass(frozen=True)
class PlanWork:
    """What one agent can do for one started plan now: the places of the plan's ready tasks the agent may take,
    and what the plan's unfinished tasks wait on. It writes the lines an agent reads about that work."""

    plan: Plan
    ready_places: tuple[PlanTask, ...]
    unblockers: Unblockers

    @property
    def is_workable(self) -> bool:
        return bool(self.ready_places) or bool(self.unblockers.candidates)

    def focus_lines(self) -> list[str]:
        takeable = sorted(self.unblockers.candidates, key=lambda candidate: (-candidate.unlocks, candidate.task_id))
        return [*(f"task {candidate.task_id} holds back {candidate.unlocks} {'task' if candidate.unlocks == 1 else 'tasks'} of plan {self.plan.id}: you can take it" for candidate in takeable),
                *(f"it waits on task {line.task_id}, {line.text}" for line in self.unblockers.waiting)]

    def summary_lines(self) -> list[str]:
        if self.is_workable:
            return [f"plan {self.plan.id}: has work you can take"]
        return [f"plan {self.plan.id}: waits on task {line.task_id}, {line.text}" for line in self.unblockers.waiting] or [f"plan {self.plan.id}: has no task you can take"]
