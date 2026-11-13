from dataclasses import dataclass


@dataclass(frozen=True)
class DoorRefusal:
    """The status and the reason a request is turned away with at the door."""

    status: int
    reason: str
