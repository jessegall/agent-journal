from enum import StrEnum


class ShareLinkState(StrEnum):
    """Whether a share link still opens what it names."""

    ACTIVE = "active"
    REVOKED = "revoked"
