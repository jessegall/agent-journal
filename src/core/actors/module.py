from core.actors.actor_record import ActorRecord
from core.base.module.module import Module
from core.base.module.noun import Noun


class ActorsModule(Module):
    """Gives the actors table, which the core owns, its noun: journal actor make, show, list, edit and delete."""

    name = "actors"
    requires_core = ">=5,<6"
    nouns = (Noun(ActorRecord),)
