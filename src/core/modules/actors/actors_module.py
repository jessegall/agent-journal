from core.modules.actors.models.declarations.actor_record_model_declaration import ActorRecordModelDeclaration
from core.modules.actors.upgrade.actors_move import ActorsMove
from engine.module.module import Module
from core.modules.actors.seeders.actors_seeder import ActorsSeeder


class ActorsModule(Module):
    """Gives the actors table, which the core owns, its commands: journal actor make, show, list, edit and
    delete."""

    name = "journal.core.actors"
    requires_engine = ">=5,<6"
    models = [ActorRecordModelDeclaration]
    seeders = [ActorsSeeder]
    moves = [ActorsMove]
