from engine.change.created import Created
from engine.change.deleted import Deleted
from engine.change.logged_event import LoggedEvent
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from suites.coding.modules.workers.listeners.task_route_change_listener import TaskRouteChangeListener


class TaskTagRouteMarkListener(TaskRouteChangeListener[Created[TaskTag] | Deleted[TaskTag]]):
    """Shows an agent adding or removing a routed task's tag."""

    name = "workers.task-tag-route-mark"

    def handle(self, event: Created[TaskTag] | Deleted[TaskTag], logged: LoggedEvent) -> None:
        task = self.event_rows.required(Task, event.row.task_id)
        route_tasks = self.routes.task_matches([task])
        route = route_tasks.first_match(task)
        if route is None:
            route = route_tasks.without_tag(task, event.row.word) if isinstance(event, Created) else route_tasks.with_tag(task, event.row.word)
        self.show_route(task, route, logged)
