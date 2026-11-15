from enum import StrEnum


class LineCategory(StrEnum):
    """What a line is for: information the agent reads, or steering it acts on."""

    INFORMATION = "information"
    STEERING = "steering"
