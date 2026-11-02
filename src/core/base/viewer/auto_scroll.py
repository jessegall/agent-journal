from enum import StrEnum


class AutoScroll(StrEnum):
    """The end of its list a window stays at as rows arrive, until the person scrolls away from it."""

    NONE = ""
    BOTTOM = "bottom"
    TOP = "top"
