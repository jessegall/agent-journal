from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.enums.actor_type import ActorType
from engine.event.deleted import Deleted
from engine.event.updated import Updated
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.listener.rows.event_rows import EventRows
from core.modules.actors.models.actor_record import ActorRecord
from suites.coding.modules.workers.commands.delete_worker_route.delete_worker_route import DeleteWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class WorkerRouteOwnerGuard(Guard[Updated[WorkerRoute] | Deleted[WorkerRoute]]):
    """A user owns the routes they made; deleting another route may close a gap."""

    name = "workers.route-owner"
    is_safety = True

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, event: Updated[WorkerRoute] | Deleted[WorkerRoute], context: Context) -> None:
        if context.actor.type is ActorType.USER or event.row.creator_id == context.actor.id:
            return
        if isinstance(event, Updated) and isinstance(context.command, DeleteWorkerRoute):
            return
        owner = self.rows.required(ActorRecord, event.row.creator_id)
        if owner.type is ActorType.USER:
            raise UserApprovalRefusal(f"Change task route {event.row.id}?", command=context.command)
