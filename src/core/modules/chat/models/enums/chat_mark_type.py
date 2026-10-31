from enum import StrEnum


class ChatMarkType(StrEnum):
    """The chat mark types the chat module adds."""

    FAULT = "chat.fault"
    UPGRADE = "chat.upgrade"
