from enum import IntEnum


class WindowPriority(IntEnum):
    """How soon a window's requests run: FIRST does not wait for hooks, NORMAL waits behind them up to a limit."""

    FIRST = 0
    NORMAL = 1
