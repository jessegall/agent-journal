from enum import StrEnum


class EventForm(StrEnum):
    """When a plugin's script runs for an event: before the change, during it, or after it is final."""

    GUARD = "guard"
    LISTEN = "listen"
    COMMIT = "commit"
