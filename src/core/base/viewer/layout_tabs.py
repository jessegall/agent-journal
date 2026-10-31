from dataclasses import dataclass


@dataclass(frozen=True)
class LayoutTabs:
    """A pane of the viewer that shows its windows as tabs, one of them active."""

    windows: tuple[str, ...]
    active: str
