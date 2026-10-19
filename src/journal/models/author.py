from enum import StrEnum

from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind


class Author(StrEnum):
    USER = "user"
    AGENT = "agent"
    SYSTEM = "system"

    @classmethod
    def of(cls, actor: Actor) -> "Author":
        """Whose side of the chat a write sits on: the agent's, the user's, or the journal's for the system and a plugin."""
        return {ActorKind.AGENT: cls.AGENT, ActorKind.USER: cls.USER, ActorKind.PHONE: cls.USER}.get(actor.kind, cls.SYSTEM)
