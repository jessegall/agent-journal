from dataclasses import dataclass


@dataclass(frozen=True)
class TimedReminder:
    """A reminder set for a moment: its number, its words and its moment as a timestamp."""

    id: int
    text: str
    due_at: float
