from typing import NamedTuple


class WindowSize(NamedTuple):
    """The size in pixels a window starts at when it floats or is detached."""

    width: int
    height: int
