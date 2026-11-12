from collections.abc import Sequence
from dataclasses import replace

from engine.database.kept_rows import KeptRows
from engine.enums.model_tier import ModelTier
from engine.provider.providers import Providers
from engine.query.conditions.among import Among
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.route_tasks import RouteTasks


class WorkerRoutes:
    """Reads ordered routes and combines the first matches of a batch."""

    def __init__(self, queries: Queries, providers: Providers, kept: KeptRows) -> None:
        self.queries, self.providers, self.kept = queries, providers, kept

    def listed(self) -> tuple[WorkerRoute, ...]:
        routes = self.queries.query(WorkerRoute).matching(Minimum("position", 1)).ordered("position")
        return self.kept.read(routes, lambda: tuple(routes.all_rows()), name="workers.routes")

    def task_matches(self, tasks: Sequence[Task]) -> RouteTasks:
        programs = {provider.name for provider in self.providers.all()}
        routes = tuple(route for route in self.listed() if not route.program or route.program in programs)
        task_tags: dict[int, list[str]] = {task.id: [] for task in tasks}
        if routes:
            task_ids = tuple(task_tags)
            route_tags = self.queries.query(TaskTag).matching(Among("task_id", task_ids))
            tags = self.kept.read(route_tags, lambda: tuple(route_tags.all_rows()), name="workers.route_tags")
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
