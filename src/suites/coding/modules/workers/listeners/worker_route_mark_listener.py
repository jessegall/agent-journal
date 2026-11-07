from core.base.actor_type import ActorType
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.change.logged_event import LoggedEvent
from core.base.change.updated import Updated
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.listeners.mark_listener import MarkListener
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class WorkerRouteMarkListener(MarkListener[Created[WorkerRoute] | Updated[WorkerRoute] | Deleted[WorkerRoute]]):
    """Shows an agent's changes to routes."""

    name = "workers.route-mark"
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Created[WorkerRoute] | Updated[WorkerRoute] | Deleted[WorkerRoute], logged: LoggedEvent) -> None:
        if self.event_rows.required(ActorRecord, logged.actor_id).type is not ActorType.AGENT:
            return
        route = event.row
        action = "changed"
        if isinstance(event, Created):
            action = "created"
        if isinstance(event, Deleted):
            action = "deleted"
        tier = route.tier.value if route.tier is not None else "profile model"
        self.show(logged, WorkerMarkType.SPLIT, WorkerMarkVariant.ROUTE,
                  f"Agent {logged.actor_id} {action} route {route.id}", row_model="worker_routes", row_id=route.id,
                  detail=f"Program: {route.program or 'the split'}. Tier: {tier}. Tags: {', '.join(route.tags)}")
