from dataclasses import dataclass

from sync_server.pushed_change import PushedChange


@dataclass(frozen=True)
class PushRequest:
    """A device's push: its queued changes in order, and how far the server's clock is ahead of the device's, which the device measured from the server's time in its last answer."""

    clock_offset: float
    changes: tuple[PushedChange, ...]

    @classmethod
    def parsed(cls, changes: list, clock_offset: float = 0.0) -> "PushRequest":
        return cls(float(clock_offset), tuple(PushedChange(**change) for change in changes))
