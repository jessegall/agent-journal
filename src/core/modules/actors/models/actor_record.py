from dataclasses import dataclass

from engine.enums.actor_type import ActorType
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class ActorRecord(Model):
    """A row of the actors table: a person, an agent, a module or the core, unique by type and name. The Actor
    value in the engine is what a command carries; this is the row it points to."""

    model_name = "actor"
    cli_name = "actor"
    table = "actors"

    type: ActorType
    name: str
    creator_id: int | None = None

    def is_agent(self) -> bool:
        return self.type is ActorType.AGENT
