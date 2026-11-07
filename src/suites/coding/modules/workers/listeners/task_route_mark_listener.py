from core.base.actor_type import ActorType
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.change.updated import Updated
from core.base.command.bus import Bus
from core.base.listener.event_rows import EventRows
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.worker_route_policy import ROUTE_HOLDS
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes


class TaskRouteMarkListener(MarkListener[Updated[Task] | Moved[Task] | Created[TaskTag] | Deleted[TaskTag]]):
    """Shows an agent changing routed task criteria or skipping its route."""

    name = "workers.task-route-mark"
    module_name = "journal.suites.coding.workers"
    moves = (TaskLifecycle.release,)

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, event_rows: EventRows, routes: WorkerRoutes) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.routes = routes

    def handle(self, event: Updated[Task] | Moved[Task] | Created[TaskTag] | Deleted[TaskTag], logged: LoggedEvent) -> None:
        if self.event_rows.required(ActorRecord, logged.actor_id).type is not ActorType.AGENT:
            return
        if isinstance(event.row, Task) and "complexity" not in logged.data and ROUTE_HOLDS not in logged.skipped_guards:
            return
        task = self.event_rows.required(Task, event.row.task_id) if isinstance(event.row, TaskTag) else event.row
        route = self.changed_route(event, task)
        if route is None:
            return
        variant = WorkerMarkVariant.TASK_ROUTE
        action = "changed tags or complexity"
        if ROUTE_HOLDS in logged.skipped_guards:
            variant, action = WorkerMarkVariant.ROUTE_SKIPPED, "skipped its route"
        self.show(logged, WorkerMarkType.SPLIT, variant,
                  f"Agent {logged.actor_id} {action} for task {task.id}", row_model="tasks", row_id=task.id,
                  detail=f"Route {route.id}: {route.program or 'the split'}")

    def changed_route(self, event: Updated[Task] | Moved[Task] | Created[TaskTag] | Deleted[TaskTag], task: Task) -> WorkerRoute | None:
        read = self.routes.task_matches([task])
        route = read.first_match(task)
        if route is not None:
            return route
        if isinstance(event, Created) and isinstance(event.row, TaskTag):
            return read.without_tag(task, event.row.word)
        if isinstance(event, Deleted) and isinstance(event.row, TaskTag):
            return read.with_tag(task, event.row.word)
        if isinstance(event.old_row, Task):
            return read.first_match(event.old_row)
        return None
