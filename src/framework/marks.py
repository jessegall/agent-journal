"""What the triggers keep for a session by a name: when it last fired and what has been counted since."""

from engine import triggering


def mark_of(record, session: str, name: str):
    return triggering.last(record, session, name)
