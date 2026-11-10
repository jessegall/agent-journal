from enum import StrEnum


class RequiredAgents(StrEnum):
    """Which agents read a skill at the start."""

    ALL = "all"
    MAIN = "main"
    NONE = "none"
