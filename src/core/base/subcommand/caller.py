from dataclasses import dataclass

from core.base.actor import Actor


@dataclass(frozen=True)
class Caller:
    """Who runs a command line and where: the actor, and the environment it runs in, if any."""

    actor: Actor
    environment_id: int | None = None
