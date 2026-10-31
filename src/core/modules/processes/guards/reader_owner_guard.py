from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.processes.models.reader import Reader


class ReaderOwnerGuard(Guard):
    """Refuses the removal of a reader the core or another module made; only the one that made it removes it."""

    name = "processes.reader-owner"
    event = "reader.delete"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        reader = change.row
        if not isinstance(reader, Reader) or reader.creator_id == change.actor.id:
            return
        owner = self.queries.query(ActorRecord).find(reader.creator_id)
        if owner.type in (ActorType.MODULE, ActorType.CORE):
            raise Refusal(f"reader {reader.name} was made by {owner.name}, and only that module removes it", "a reader of your own is removed with journal reader remove")
