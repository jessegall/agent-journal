from dataclasses import dataclass
from datetime import datetime

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Phone(Scoped):
    """A phone paired with the journal through the tunnel: the name its browser gave, its key's hash, and how long it stays paired."""

    name: str = ""
    key: str = ""
    """The hash of the key the phone holds; the key itself is never kept."""
    expires_at: datetime | None = None
    last_seen_at: datetime | None = None
    ended_at: datetime | None = None
    """When it was disconnected, from the desk or from the phone."""

    def is_live(self, now: datetime) -> bool:
        return self.ended_at is None and self.expires_at is not None and self.expires_at > now

    def seen(self, at: datetime) -> "Phone":
        return self.with_(last_seen_at=at)

    def ended(self, at: datetime) -> "Phone":
        return self.with_(ended_at=at)
