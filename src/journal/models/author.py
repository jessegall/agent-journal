from enum import StrEnum

from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind


class Author(StrEnum):
    USER = "user"
    AGENT = "agent"
    SYSTEM = "system"

    @classmethod
    def build(cls, actor: Actor) -> "Author":
        return {ActorKind.AGENT: cls.AGENT, ActorKind.USER: cls.USER, ActorKind.PHONE: cls.USER}.get(actor.kind, cls.SYSTEM)
