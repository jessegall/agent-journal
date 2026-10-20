from enum import StrEnum


class ActorKind(StrEnum):
    SYSTEM = "system"
    AGENT = "agent"
    USER = "user"
    PLUGIN = "plugin"
    PHONE = "phone"
    EXTERNAL = "external"
    """An agent of another project or session, by the name it goes by, such as a Claude session that sent a message across."""
