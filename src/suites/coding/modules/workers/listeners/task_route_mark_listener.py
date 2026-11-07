from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.change.updated import Updated
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.listeners.task_route_change_listener import TaskRouteChangeListener
from suites.coding.modules.workers.support.worker_route_policy import ROUTE_GUARD


class TaskRouteMarkListener(TaskRouteChangeListener[Updated[Task] | Moved[Task]]):
    """Shows an agent changing a routed task's complexity or skipping its route."""

    name = "workers.task-route-mark"
    moves = tuple([TaskLifecycle.release])

    def handle(self, event: Updated[Task] | Moved[Task], logged: LoggedEvent) -> None:
        if "complexity" not in logged.data and ROUTE_GUARD not in logged.skipped_guards:
            return
        route_tasks = self.routes.task_matches([event.row])
        route = route_tasks.first_match(event.row) or route_tasks.first_match(event.old_row)
        self.show_route(event.row, route, logged)
