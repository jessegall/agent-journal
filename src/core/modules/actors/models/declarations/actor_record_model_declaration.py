from engine.module.model_declaration import ModelDeclaration
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.actors.queries.actor_query import ActorQuery


class ActorRecordModelDeclaration(ModelDeclaration):
    """How the module declares ActorRecord."""

    model = ActorRecord
    query = ActorQuery
