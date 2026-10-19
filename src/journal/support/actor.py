from dataclasses import dataclass

from journal.support.actor_kind import ActorKind


@dataclass(frozen=True)
class Actor:
    """Who did something: the system, an agent by its session, a user by their id, a plugin by its name, or the user's paired phone by its number. Stored as one string, kind:id, on every row and every entry."""

    kind: ActorKind
    id: str = ""

    @classmethod
    def system(cls) -> "Actor":
        return cls(ActorKind.SYSTEM)

    @classmethod
    def agent(cls, session: str) -> "Actor":
        return cls(ActorKind.AGENT, session)

    @classmethod
    def user(cls, id: int) -> "Actor":
        return cls(ActorKind.USER, str(id))

    @classmethod
    def plugin(cls, name: str) -> "Actor":
        return cls(ActorKind.PLUGIN, name)

    @classmethod
    def phone(cls, id: int) -> "Actor":
        return cls(ActorKind.PHONE, str(id))

    @classmethod
    def parse(cls, stamp: str) -> "Actor":
        kind, _, id = stamp.partition(":")
        return cls(ActorKind(kind), id)

    @property
    def named(self) -> str:
        """The actor as a label names it: the journal, the agent, you, or the plugin by its name."""
        return {ActorKind.SYSTEM: "the journal", ActorKind.AGENT: "the agent", ActorKind.USER: "you", ActorKind.PHONE: "you, from your phone"}.get(self.kind, f"plugin {self.id}")

    def is_the_user(self) -> bool:
        """The user, at the desk or from the paired phone, which acts for them."""
        return self.kind in (ActorKind.USER, ActorKind.PHONE)

    @property
    def stamp(self) -> str:
        return f"{self.kind.value}:{self.id}" if self.id else self.kind.value
