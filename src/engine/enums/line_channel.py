from enum import StrEnum


class LineChannel(StrEnum):
    """How a line reaches its agent: now, waiting for the next event that carries lines, or on the terminal."""

    NOW = "now"
    WAITING = "waiting"
    TERMINAL = "terminal"
