from enum import StrEnum


class WorkContextOrder(StrEnum):
    """The order in which a conversation page selects messages."""

    OLDEST = "oldest"
    NEWEST = "newest"

    def command(self) -> str:
        return " --newest" if self is WorkContextOrder.NEWEST else ""
