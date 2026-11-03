from enum import StrEnum


class WindowShows(StrEnum):
    """Whose work a window shows: the environment's, or an agent selected by its pane or parent."""

    ENVIRONMENT = "environment"
    SELECTED_AGENT = "one-agent"
