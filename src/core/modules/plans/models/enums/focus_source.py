from enum import StrEnum


class FocusSource(StrEnum):
    """Where the plan focus of an agent comes from: the default, or the agent named the plan itself."""

    DEFAULT = "default"
    EXPLICIT = "explicit"
