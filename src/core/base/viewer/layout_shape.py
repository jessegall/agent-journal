from enum import StrEnum


class LayoutShape(StrEnum):
    """How a page of the viewer arranges its windows: as tabs, or split side by side."""

    TABS = "tabs"
    SPLIT = "split"
