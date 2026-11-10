from engine.enums.actor_type import ActorType
from engine.change.event_subscriber import E
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.event_rows import EventRows
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.worker_route_policy import ROUTE_GUARD
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes


class TaskRouteChangeListener(MarkListener[E]):
    """Shares the mark for an agent changing a routed task."""

    module_name = "journal.suites.coding.workers"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, event_rows: EventRows, routes: WorkerRoutes) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.routes = routes

    def show_route(self, task: Task, route: WorkerRoute | None, logged: LoggedEvent) -> None:
        if route is None or self.event_rows.required(ActorRecord, logged.actor_id).type is not ActorType.AGENT:
            return
        variant = WorkerMarkVariant.TASK_ROUTE
        action = "changed tags or complexity"
        if ROUTE_GUARD in logged.skipped_guards:
            variant, action = WorkerMarkVariant.ROUTE_SKIPPED, "skipped its route"
        self.show(logged, WorkerMarkType.SPLIT, variant,
                  f"Agent {logged.actor_id} {action} for task {task.id}", row_model="tasks", row_id=task.id,
                  detail=f"Route {route.id}: {route.program or 'the split'}")
