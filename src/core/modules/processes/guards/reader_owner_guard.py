from engine.enums.actor_type import ActorType
from engine.guard.guard import Guard
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.processes.models.reader import Reader
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class ReaderOwnerGuard(Guard[Deleted[Reader]]):
    """Refuses the removal of a reader the core or another module made; only the one that made it removes it.
    """

    name = "processes.reader-owner"
    is_safety = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Deleted[Reader], context: Context) -> None:
        reader = event.row
        if reader.creator_id == context.actor.id:
            return
        owner = self.queries.query(ActorRecord).find(reader.creator_id)
        if owner.type in (ActorType.MODULE, ActorType.CORE):
            raise Refusal(f"reader {reader.name} was made by {owner.name}, and only that module removes it", "a reader of your own is removed with journal reader remove")
