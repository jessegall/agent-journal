from enum import StrEnum


class ChatMarkType(StrEnum):
    """The chat mark types the chat module adds."""

    EXCEPTION = "chat.exception"
    UPGRADE = "chat.upgrade"
