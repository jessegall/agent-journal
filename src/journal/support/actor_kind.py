from enum import StrEnum


class ActorKind(StrEnum):
    SYSTEM = "system"
    AGENT = "agent"
    USER = "user"
    PLUGIN = "plugin"
    PHONE = "phone"
