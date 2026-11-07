from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worker_route import WorkerRoute


@dataclass(frozen=True)
class RouteTasks:
    """Routes and tags read together for one set of tasks."""

    routes: Sequence[WorkerRoute]
    task_tags: Mapping[int, Sequence[str]]

    def candidate(self, task: Task) -> WorkerRoute | None:
        return next((route for route in self.routes
                     if route.matches_tags(self.task_tags[task.id])
                     and (route.matches(self.task_tags[task.id], task.complexity)
                          or (route.needs_complexity and task.complexity is None))), None)

    def first_match(self, task: Task) -> WorkerRoute | None:
        route = self.candidate(task)
        return route if route is not None and route.matches(self.task_tags[task.id], task.complexity) else None

    def missing_score(self, task: Task) -> bool:
        route = self.candidate(task)
        return task.complexity is None and route is not None and route.needs_complexity
