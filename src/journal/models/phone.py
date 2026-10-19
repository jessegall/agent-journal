from dataclasses import dataclass
from datetime import datetime, timedelta

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Phone(Scoped):
    """A phone paired with the journal through the tunnel: the name its browser gave, its key's hash, and how long it stays paired."""

    SEEN_EVERY = timedelta(minutes=1)

    name: str = ""
    key: str = ""
    """The hash of the key the phone holds; the key itself is never kept."""
    expires_at: datetime | None = None
    last_seen_at: datetime | None = None
    ended_at: datetime | None = None
    """When it was disconnected, from the desk or from the phone."""

    def is_live(self, now: datetime) -> bool:
        return self.ended_at is None and self.expires_at is not None and self.expires_at > now

    def is_due_a_sighting(self, now: datetime) -> bool:
        """Last seen long enough ago to be written down again: once a minute at most, so reads write nothing in between."""
        return self.last_seen_at is None or now - self.last_seen_at >= self.SEEN_EVERY

    def seen(self, at: datetime) -> "Phone":
        return self.with_(last_seen_at=at)

    def ended(self, at: datetime) -> "Phone":
        return self.with_(ended_at=at)
