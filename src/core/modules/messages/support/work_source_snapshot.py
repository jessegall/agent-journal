from dataclasses import dataclass


@dataclass(frozen=True)
class WorkSourceSnapshot:
    """The request authorized for one job when it was assigned."""

    message_id: int | None
    version: int
    environment_id: int
    unavailable: bool = False
