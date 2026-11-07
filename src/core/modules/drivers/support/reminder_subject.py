from dataclasses import dataclass

from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class ReminderSubject:
    """One thing a reminder names, and when it last moved."""

    subject: str
    moved_at: Timestamp
