from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.focus.unblockers import Unblockers
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class PlanWork:
    """What one agent can do for one started plan now: the places of the plan's ready tasks the agent may take,
    and what the plan's unfinished tasks wait on. It writes the lines an agent reads about that work, and
    picks the task to take first: the one the most plan tasks wait on, then the highest priority, then a task
    of the plan before a task outside it, then the place in the phase, then the lowest number."""

    plan: Plan
    ready_places: tuple[PlanTask, ...]
    unblockers: Unblockers

    @property
    def is_workable(self) -> bool:
        return bool(self.ready_places) or bool(self.unblockers.candidates)

    def task_ids(self) -> tuple[int, ...]:
        return tuple(sorted({place.task_id for place in self.ready_places} | {candidate.task_id for candidate in self.unblockers.candidates}))

    def first(self, tasks: Sequence[Task]) -> Task | None:
        places = {place.task_id: place for place in self.ready_places}
        unlocks = {candidate.task_id: candidate.unlocks for candidate in self.unblockers.candidates}

        def rank(task: Task) -> tuple[int, int, bool, int, int]:
            place = places.get(task.id)
            return (-unlocks.get(task.id, 0), -task.priority, place is None, 0 if place is None else place.position, task.id)

        return min(tasks, key=rank, default=None)

    def ready_task_ids(self) -> tuple[int, ...]:
        return tuple(place.task_id for place in self.ready_places)

    @staticmethod
    def most_urgent(tasks: Sequence[Task]) -> Task | None:
        return min(tasks, key=lambda task: (-task.priority, task.id), default=None)

    def focus_lines(self) -> list[str]:
        takeable = sorted(self.unblockers.candidates, key=lambda candidate: (-candidate.unlocks, candidate.task_id))
        return [*(f"task {candidate.task_id} holds back {candidate.unlocks} {'task' if candidate.unlocks == 1 else 'tasks'} of plan {self.plan.id}: you can take it" for candidate in takeable),
                *(f"it waits on task {line.task_id}, {line.text}" for line in self.unblockers.waiting)]

    def summary_lines(self) -> list[str]:
        if self.is_workable:
            return [f"plan {self.plan.id}: has work you can take"]
        return [f"plan {self.plan.id}: waits on task {line.task_id}, {line.text}" for line in self.unblockers.waiting] or [f"plan {self.plan.id}: has no task you can take"]
