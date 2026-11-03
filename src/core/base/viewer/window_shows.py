from enum import StrEnum


class WindowShows(StrEnum):
    """Whose work a window shows: the environment's, or one agent's, which the pane menu's Agent row picks."""

    ENVIRONMENT = "environment"
    ONE_AGENT = "one-agent"
