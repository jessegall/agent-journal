from enum import StrEnum


class ShareLinkState(StrEnum):
    """Whether a share link opens what it names: an agent's waits for a person, who accepts or denies it."""

    WAITING = "waiting"
    ACTIVE = "active"
    REVOKED = "revoked"
    DENIED = "denied"
