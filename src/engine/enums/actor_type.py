from enum import StrEnum


class ActorType(StrEnum):
    """The types of actor: a person, an agent, a module or the core. A person and an agent can take work."""

    USER = "user"
    AGENT = "agent"
    MODULE = "module"
    CORE = "core"

    @property
    def can_receive_work(self) -> bool:
        return self in (ActorType.USER, ActorType.AGENT)
