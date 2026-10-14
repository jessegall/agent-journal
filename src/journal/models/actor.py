from dataclasses import dataclass

from journal.models.actor_kind import ActorKind


@dataclass(frozen=True)
class Actor:
    """Who did something: the system, an agent by its session, or a user by their id. Stored as one string, kind:id, on every row and every entry."""

    kind: ActorKind
    id: str = ""

    @classmethod
    def system(cls) -> "Actor": ...

    @classmethod
    def agent(cls, session: str) -> "Actor": ...

    @classmethod
    def user(cls, id: int) -> "Actor": ...

    @classmethod
    def parse(cls, stamp: str) -> "Actor": ...

    @property
    def stamp(self) -> str: ...
