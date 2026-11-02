from dataclasses import dataclass

from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class ShareInvitation:
    """A link's number, the token shown this once and the path that carries it, and when it stops working, if
    it does; an agent's request waits for a person, so it has no token yet."""

    id: int
    state: str
    token: str | None
    link: str | None
    expires_at: Timestamp | None
