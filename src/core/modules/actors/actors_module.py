from core.modules.actors.queries.actor_query import ActorQuery
from core.modules.actors.models.actor_record import ActorRecord
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration


class ActorsModule(Module):
    """Gives the actors table, which the core owns, its commands: journal actor make, show, list, edit and delete."""

    name = "journal.core.actors"
    requires_core = ">=5,<6"
    models = [ModelDeclaration(ActorRecord, query=ActorQuery)]
