from enum import StrEnum


class DockItemState(StrEnum):
    """Whether an item sits in the dock above the chat, or left it."""

    DOCKED = "docked"
    UNDOCKED = "undocked"
