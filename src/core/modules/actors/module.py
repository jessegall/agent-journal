from core.modules.actors.actor_query import ActorQuery
from core.modules.actors.actor_record import ActorRecord
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration


class ActorsModule(Module):
    """Gives the actors table, which the core owns, its commands: journal actor make, show, list, edit and delete."""

    name = "actors"
    requires_core = ">=5,<6"
    models = [ModelDeclaration(ActorRecord, query=ActorQuery)]
