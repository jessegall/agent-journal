from enum import StrEnum


class WindowPlace(StrEnum):
    """Where a window belongs: the environment, one agent, a dropdown of the bars, or on the top bar itself."""

    ENVIRONMENT = "environment"
    AGENT = "agent"
    DROPDOWN = "dropdown"
    BAR = "bar"
