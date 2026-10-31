from dataclasses import dataclass

from core.base.actor import ActorType
from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class ActorRecord(Model):
    """A row of the actors table: a person, an agent, a module or the core, unique by type and name. The Actor
    value in core.base is what a command carries; this is the row it points to."""

    model_name = "actor"
    cli_name = "actor"
    table = "actors"

    type: ActorType
    name: str
    creator_id: int | None = None
