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
    expires_at: datetime | None = None
    last_seen_at: datetime | None = None
    ended_at: datetime | None = None
    push: str = ""
    pushed: str = ""
    push_failed_at: datetime | None = None

    def is_live(self, time: datetime) -> bool:
        return self.ended_at is None and self.expires_at is not None and self.expires_at > time

    def is_due_a_sighting(self, time: datetime) -> bool:
        return self.last_seen_at is None or time - self.last_seen_at >= self.SEEN_EVERY

    def seen(self, time: datetime) -> "Phone":
        return self.with_(last_seen_at=time)

    def pushed_refs(self) -> list[str]:
        return self.pushed.split()

    def has_news(self, owed: list[str]) -> bool:
        return bool(set(owed) - set(self.pushed_refs()))

    def is_owed_a_push(self, owed: list[str], time: datetime) -> bool:
        resting = self.push_failed_at is not None and time - self.push_failed_at < self.PUSH_RETRY_AFTER
        return self.has_news(owed) and not resting

    def subscribed(self, endpoint: str, owed: list[str]) -> "Phone":
        return self.with_(push=endpoint, pushed=" ".join(owed))

    def told(self, owed: list[str]) -> "Phone":
        return self.with_(pushed=" ".join(owed), push_failed_at=None)

    def push_failed(self, time: datetime) -> "Phone":
        return self.with_(push_failed_at=time)

    def unsubscribed(self) -> "Phone":
        return self.with_(push="", push_failed_at=None)

    def ended(self, time: datetime) -> "Phone":
        return self.with_(ended_at=time)
