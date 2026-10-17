from dataclasses import dataclass

from journal.models.actor_kind import ActorKind


@dataclass(frozen=True)
class Actor:
    """Who did something: the system, an agent by its session, a user by their id, or a plugin by its name. Stored as one string, kind:id, on every row and every entry."""

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
    def parse(cls, stamp: str) -> "Actor":
        kind, _, id = stamp.partition(":")
        return cls(ActorKind(kind), id)

    @property
    def named(self) -> str:
        """The actor as a label names it: the journal, the agent, you, or the plugin by its name."""
        return {ActorKind.SYSTEM: "the journal", ActorKind.AGENT: "the agent", ActorKind.USER: "you"}.get(self.kind, f"plugin {self.id}")

    @property
    def stamp(self) -> str:
        return f"{self.kind.value}:{self.id}" if self.id else self.kind.value
