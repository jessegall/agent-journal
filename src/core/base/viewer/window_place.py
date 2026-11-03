from enum import StrEnum


class WindowPlace(StrEnum):
    """Where a window is drawn: in a pane, in a dropdown of the bars, on the top bar itself, or on a page of its
    own that the sidebar lists and no pane offers."""

    PANE = "pane"
    DROPDOWN = "dropdown"
    HEADER = "bar"
    PAGE = "page"
