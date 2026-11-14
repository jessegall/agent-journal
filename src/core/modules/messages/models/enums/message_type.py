from enum import StrEnum


class MessageType(StrEnum):
    """Who a message is from: the user, an agent, or the journal itself; a comment is the user's, on a
    document, and a peer message comes from another agent session."""

    USER = "user"
    AGENT = "agent"
    JOURNAL = "journal"
    COMMENT = "comment"
    PEER = "peer"


PERSON_MESSAGE_TYPES = (MessageType.USER, MessageType.COMMENT)
