from dataclasses import dataclass

from journal.support.actor_kind import ActorKind


@dataclass(frozen=True)
class Actor:
    """Who did something: the system, an agent by its session, a user by their id, a plugin by its name, the user's paired phone by its number, an external agent of another project by its name, or a worker by its number. Stored as one string, kind:id, on every row and every entry."""

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
    def external(cls, name: str) -> "Actor":
        return cls(ActorKind.EXTERNAL, name)

    @classmethod
    def worker(cls, id: int) -> "Actor":
        return cls(ActorKind.WORKER, str(id))

    @classmethod
    def parse(cls, stamp: str) -> "Actor":
        kind, _, id = stamp.partition(":")
        return cls(ActorKind(kind), id)

    @property
    def lookup(self) -> str:
        return {ActorKind.SYSTEM: "the journal", ActorKind.AGENT: "the agent", ActorKind.USER: "you", ActorKind.PHONE: "you, from your phone", ActorKind.EXTERNAL: self.id, ActorKind.WORKER: f"worker {self.id}"}.get(self.kind, f"plugin {self.id}")

    def is_user(self) -> bool:
        return self.kind in (ActorKind.USER, ActorKind.PHONE)

    def agent_session(self) -> str | None:
        return self.id if self.kind == ActorKind.AGENT else None

    @property
    def stamp(self) -> str:
        return f"{self.kind.value}:{self.id}" if self.id else self.kind.value
