from dataclasses import dataclass


@dataclass(frozen=True)
class OutsideStart:
    """A file that still starts a program itself instead of through the one door, and why it must."""

    path: str
    reason: str
