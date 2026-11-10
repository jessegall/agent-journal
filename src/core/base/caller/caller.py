from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType


@dataclass(frozen=True)
class Caller:
    """Who runs a command line and where: the actor, the environment it runs in, if any, and the plugin whose
    script the line came from, if any."""

    actor: Actor
    environment_id: int | None = None
    plugin_script: str = ""
    process_id: int | None = None

    @property
    def read_actor_id(self) -> int | None:
        return self.actor.id if self.actor.type is ActorType.AGENT else None
