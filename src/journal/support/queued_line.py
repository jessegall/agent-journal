from dataclasses import dataclass


@dataclass(frozen=True)
class QueuedLine:
    """A line to type to an agent, held while an earlier one is still on its way: the seconds it was to wait go with it."""

    environment_id: int
    line: str
    after: float = 0.0
