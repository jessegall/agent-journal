from enum import StrEnum


class WindowPlace(StrEnum):
    """Where a window is drawn: in a pane, in a dropdown of the bars, on the top bar itself, on a page of its
    own that the sidebar lists and no pane offers, both on such a page and in a pane, or as a section of the
    inspectors its slots name."""

    PANE = "pane"
    DROPDOWN = "dropdown"
    HEADER = "bar"
    PAGE = "page"
    PANE_OR_PAGE = "pane_or_page"
    SECTION = "section"
