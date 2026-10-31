from enum import StrEnum


class WindowPlace(StrEnum):
    """Where a window belongs: to the environment, or to one agent, whose id it is given."""

    ENVIRONMENT = "environment"
    AGENT = "agent"
