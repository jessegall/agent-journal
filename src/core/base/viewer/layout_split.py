from dataclasses import dataclass

from core.base.viewer.layout_tabs import LayoutTabs


@dataclass(frozen=True)
class LayoutSplit:
    """A pane of the viewer split in two along a direction, row or column, the first part taking its share."""

    direction: str
    share: float
    first: "LayoutTabs | LayoutSplit"
    second: "LayoutTabs | LayoutSplit"
