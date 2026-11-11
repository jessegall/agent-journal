from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from engine.model.assignable import Assignable
from engine.module.module import Module
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.assignments.listeners.assigned_listener import AssignedListener
from core.modules.assignments.listeners.unassigned_listener import UnassignedListener
from core.modules.assignments.models.assignment import Assignment
from tests.stories.core.modules.assignments.support.assignable_samples import Crate, Shelf

DEPOT_LISTENERS = "tests.stories.core.modules.assignments.support.assignment_listeners:DepotListenersModule"
REFUSED_NAME = "Grace"
GUARD_REFUSAL = "Grace takes no crates"


class CrateAssigned(AssignedListener):
    """Writes a shelf for each crate given to an actor, so a story reads what the listener was handed."""

    name = "acme.crate-assigned"
    subject = Crate

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        super().__init__(rows)
        self.repository = repository

    def assigned(self, row: Assignable, actor_id: int, context: Context) -> None:
        self.repository.save(Shelf(title=f"assigned {row.model_name} {row.id} to {actor_id}"), context)


class CrateUnassigned(UnassignedListener):
    """Writes a shelf for each crate taken from an actor."""

    name = "acme.crate-unassigned"
    subject = Crate

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        super().__init__(rows)
        self.repository = repository

    def unassigned(self, row: Assignable, actor_id: int, context: Context) -> None:
        self.repository.save(Shelf(title=f"unassigned {row.model_name} {row.id} from {actor_id}"), context)


class GraceGuard(Guard[Created[Assignment]]):
    """Refuses every assignment to the person Grace."""

    name = "acme.grace-takes-nothing"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Created[Assignment], context: Context) -> None:
        if self.queries.query(ActorRecord).find(event.row.actor_id).name == REFUSED_NAME:
            raise Refusal(GUARD_REFUSAL)


class DepotListenersModule(Module):
    """A sample module that hears crates being assigned and unassigned, and guards assignments to one person."""

    name = "acme.depot-listeners"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments", "journal.core.actors", "acme.depot"]
    listeners = [CrateAssigned, CrateUnassigned]
    guards = [GraceGuard]
