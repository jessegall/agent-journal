from dataclasses import dataclass


@dataclass(frozen=True)
class WaitingThing:
    """One thing that waits on the user, named only by the reference of its row, such as questions:4."""

    ref: str
