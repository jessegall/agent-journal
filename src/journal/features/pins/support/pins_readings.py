from dataclasses import dataclass


@dataclass(frozen=True)
class PinsReadings:
    """The pins feature's reading: the links pinned here, and the links suggested within the last so many of the agent's own tool uses."""

    pinned: tuple[str, ...]
    suggested_lately: tuple[str, ...]
