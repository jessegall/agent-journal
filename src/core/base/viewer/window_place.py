from enum import StrEnum


class WindowPlace(StrEnum):
    """Where a window belongs: the environment, one agent, a dropdown of the bars, on the top bar itself, or a page of its own
    that the sidebar lists and no pane offers."""

    ENVIRONMENT = "environment"
    AGENT = "agent"
    DROPDOWN = "dropdown"
    HEADER = "bar"
    PAGE = "page"
