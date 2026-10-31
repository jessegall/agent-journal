import time


class DeadlinePassedError(Exception):
    """Raised right before a commit when the caller's deadline has passed, so the command writes nothing."""


class Deadline:
    """When the caller stops waiting for a command, on the monotonic clock; a run with no deadline waits as long
    as the command takes."""

    def __init__(self, ends_at: float | None = None) -> None:
        self.ends_at = ends_at

    @classmethod
    def timeout(cls, seconds: float) -> "Deadline":
        return cls(time.monotonic() + seconds)

    def remaining_seconds(self) -> float | None:
        return None if self.ends_at is None else max(0.0, self.ends_at - time.monotonic())

    def check(self) -> None:
        if self.ends_at is not None and time.monotonic() >= self.ends_at:
            raise DeadlinePassedError("the caller's deadline passed before the commit, so nothing was written")
