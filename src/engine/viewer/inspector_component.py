from dataclasses import dataclass


@dataclass(frozen=True)
class InspectorComponent:
    """A part of an inspector that a module draws itself: the name of one of its section windows, and the tab
    it is shown under (none: the main page)."""

    window: str
    tab: str = ""
