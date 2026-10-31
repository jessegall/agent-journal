from dataclasses import dataclass

from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class ShareInvitation:
    """What a person hands out to share a row: the link's number, the token shown this once, the path that
    carries it, and when it stops working."""

    id: int
    token: str
    link: str
    expires_at: Timestamp
