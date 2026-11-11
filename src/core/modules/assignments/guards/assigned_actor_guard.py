from engine.command.context import Context
from engine.event.deleted import Deleted
from engine.guard.guard import Guard
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.assignments.errors.assigned_actor_refusal import AssignedActorRefusal
from core.modules.assignments.models.assignment import Assignment


class AssignedActorGuard(Guard[Deleted[ActorRecord]]):
    """An actor that holds assignments is not deleted: the refusal says how many it holds."""

    name = "assignments.assigned-actor"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Deleted[ActorRecord], context: Context) -> None:
        assignment_count = self.queries.query(Assignment).filter(actor_id=event.row.id).count()
        if assignment_count:
            raise AssignedActorRefusal(event.row.id, assignment_count)
