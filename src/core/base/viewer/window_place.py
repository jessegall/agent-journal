from enum import StrEnum


class WindowPlace(StrEnum):
    """Where a window belongs: the environment, one agent, or a dropdown of the bars, never a tab."""

    ENVIRONMENT = "environment"
    AGENT = "agent"
    DROPDOWN = "dropdown"
