from dataclasses import dataclass


@dataclass(frozen=True)
class WindowAccess:
    """What a window may do for one person in one environment: the read and command lines allowed and still
    missing, each joined by commas, and whether its module's code is trusted in the page."""

    window: str
    reads_allowed: str
    reads_missing: str
    runs_allowed: str
    runs_missing: str
    component_trusted: bool
