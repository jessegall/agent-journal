from enum import StrEnum


class MessageType(StrEnum):
    """Who a message is from: the user, an agent, or the journal itself."""

    USER = "user"
    AGENT = "agent"
    JOURNAL = "journal"
