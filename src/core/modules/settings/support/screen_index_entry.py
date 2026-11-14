from dataclasses import dataclass


@dataclass(frozen=True)
class ScreenIndexEntry:
    """One screened setting as Find a setting lists it: what it is called, where it lives in words, and the screen
    and section that open to it."""

    key: str
    title: str
    description: str
    path: str
    screen: str
    section: str
