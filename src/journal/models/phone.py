from dataclasses import dataclass
from datetime import datetime, timedelta

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Phone(Scoped):
    """A phone paired with the journal through the tunnel: the name its browser gave, its key's hash, and how long it stays paired."""

    SEEN_EVERY = timedelta(minutes=1)
    PUSH_RETRY_AFTER = timedelta(minutes=1)

    name: str = ""
    key: str = ""
    """The hash of the key the phone holds; the key itself is never kept."""
    expires_at: datetime | None = None
    last_seen_at: datetime | None = None
    ended_at: datetime | None = None
    """When it was disconnected, from the desk or from the phone."""
    push: str = ""
    """The push service's address the phone subscribed with; empty while it has not."""
    pushed: str = ""
    """What the phone was last pushed about, by reference, a space between each, so the next push names only what is new."""
    push_failed_at: datetime | None = None
    """When the last push could not be delivered; it is tried again a minute after."""

    def is_live(self, now: datetime) -> bool:
        return self.ended_at is None and self.expires_at is not None and self.expires_at > now

    def is_due_a_sighting(self, now: datetime) -> bool:
        """Last seen long enough ago to be written down again: once a minute at most, so reads write nothing in between."""
        return self.last_seen_at is None or now - self.last_seen_at >= self.SEEN_EVERY

    def seen(self, at: datetime) -> "Phone":
        return self.with_(last_seen_at=at)

    def pushed_refs(self) -> list[str]:
        return self.pushed.split()

    def has_news(self, owed: list[str]) -> bool:
        """Something waits that the phone was not pushed about."""
        return bool(set(owed) - set(self.pushed_refs()))

    def is_owed_a_push(self, owed: list[str], now: datetime) -> bool:
        """Something new waits, and no push failed in the last minute."""
        resting = self.push_failed_at is not None and now - self.push_failed_at < self.PUSH_RETRY_AFTER
        return self.has_news(owed) and not resting

    def subscribed(self, endpoint: str, owed: list[str]) -> "Phone":
        """Subscribed to pushes, what already waits counted as pushed, so it is told only of what comes after."""
        return self.with_(push=endpoint, pushed=" ".join(owed))

    def told(self, owed: list[str]) -> "Phone":
        return self.with_(pushed=" ".join(owed), push_failed_at=None)

    def push_failed(self, at: datetime) -> "Phone":
        return self.with_(push_failed_at=at)

    def unsubscribed(self) -> "Phone":
        """The push service no longer knows the address, so it is forgotten until the phone subscribes again."""
        return self.with_(push="", push_failed_at=None)

    def ended(self, at: datetime) -> "Phone":
        return self.with_(ended_at=at)
