from enum import StrEnum


class ActorType(StrEnum):
    """The types of actor: a person, an agent, a module or the core."""

    USER = "user"
    AGENT = "agent"
    MODULE = "module"
    CORE = "core"
