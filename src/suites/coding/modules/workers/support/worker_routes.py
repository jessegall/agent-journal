from collections.abc import Sequence
from dataclasses import replace

from core.base.database.kept_rows import KeptRows
from core.base.provider.model_tier import ModelTier
from core.base.provider.providers import Providers
from core.base.query.conditions.among import Among
from core.base.query.conditions.minimum import Minimum
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.route_tasks import RouteTasks


class WorkerRoutes:
    """Reads ordered routes and combines the first matches of a batch."""

    def __init__(self, queries: Queries, providers: Providers, kept: KeptRows) -> None:
        self.queries, self.providers, self.kept = queries, providers, kept

    def listed(self) -> tuple[WorkerRoute, ...]:
        return self.kept.scoped_read("worker_routes", lambda: tuple(self.queries.query(WorkerRoute).matching(Minimum("position", 1)).ordered("position").all_rows()),
                                     "position >= ?", [1], name="workers.routes")

    def task_matches(self, tasks: Sequence[Task]) -> RouteTasks:
        programs = {provider.name for provider in self.providers.all()}
        routes = tuple(route for route in self.listed() if not route.program or route.program in programs)
        task_tags: dict[int, list[str]] = {task.id: [] for task in tasks}
        if routes:
            task_ids = tuple(task_tags)
            tags = self.kept.read("task_tags",
                                 lambda: tuple(self.queries.query(TaskTag).matching(Among("task_id", task_ids)).all_rows()),
                                 f"task_id IN ({', '.join('?' for _ in task_ids)})", task_ids, name="workers.route_tags")
            for tag in tags:
                task_tags[tag.task_id].append(tag.word)
        return RouteTasks(routes, task_tags)

    def first_match(self, task: Task) -> WorkerRoute | None:
        return self.task_matches([task]).first_match(task)

    def common_route(self, tasks: Sequence[Task]) -> WorkerRoute | None:
        route_tasks = self.task_matches(tasks)
        missing = [task for task in tasks if route_tasks.missing_score(task)]
        if missing:
            lines = "; ".join(f"task {task.id} has no complexity: journal task edit {task.id} --complexity <1-5>" for task in missing)
            raise Refusal(lines, "score these tasks before dispatch")
        matches = {task.id: route for task in tasks if (route := route_tasks.first_match(task)) is not None}
        if not matches:
            return None
        programs = {route.program for route in matches.values() if route.program}
        if len(programs) > 1:
            groups = ", ".join(f"task {task_id} goes to {route.program} (route {route.id})"
                               for task_id, route in matches.items() if route.program)
            raise Refusal(groups, "dispatch them apart; for a plan, use --phase")
        selected = next((route for route in matches.values() if route.program), next(iter(matches.values())))
        tiers = [route.tier for route in matches.values() if route.tier is not None]
        order = {ModelTier.FAST: 0, ModelTier.GENERAL: 1, ModelTier.STRONGEST: 2}
        tier = max(tiers, key=order.__getitem__) if tiers else None
        return replace(selected, tier=tier, strict=any(route.strict for route in matches.values()))
