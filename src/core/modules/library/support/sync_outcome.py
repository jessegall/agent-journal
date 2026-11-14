from dataclasses import dataclass


@dataclass(frozen=True)
class SyncOutcome:
    """What one sync round did: whether the server answered, whether the round changed any row, and the line a user
    reads."""

    has_reached: bool
    has_changed: bool
    line: str

    @classmethod
    def idle(cls, line: str) -> "SyncOutcome":
        return cls(True, False, line)

    @classmethod
    def reached(cls, copies: int, changed: int, has_changed: bool) -> "SyncOutcome":
        return cls(True, has_changed, f"Reached the library. {copies} copies followed, {changed} changed.")

    @classmethod
    def failed(cls, reason: str, has_changed: bool) -> "SyncOutcome":
        return cls(False, has_changed, f"Did not reach the library. {reason}")
