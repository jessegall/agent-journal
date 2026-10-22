from typing import ClassVar
from dataclasses import dataclass, field
from datetime import datetime, timedelta

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Phone(Scoped):
    """A phone paired with the journal through the tunnel: the name its browser gave, its key's hash, and how long it stays paired."""

    shared: ClassVar[bool] = False

    PRESENCE_INTERVAL = timedelta(minutes=1)
    NOTIFICATION_RETRY_DELAY = timedelta(minutes=1)

    name: str = ""
    key: str = ""
    expires_at: datetime = field(kw_only=True)
    last_visited_at: datetime | None = None
    ended_at: datetime | None = None
    subscription: str = ""
    pushed: str = ""
    subscription_failed_at: datetime | None = None

    def is_active(self, time: datetime) -> bool:
        return self.ended_at is None and self.expires_at > time

    def is_presence_due(self, time: datetime) -> bool:
        return self.last_visited_at is None or time - self.last_visited_at >= self.PRESENCE_INTERVAL

    def visit(self, time: datetime) -> "Phone":
        return self.with_(last_visited_at=time)

    def pushed_refs(self) -> list[str]:
        return self.pushed.split()

    def has_updates(self, obligations: list[str]) -> bool:
        return bool(set(obligations) - set(self.pushed_refs()))

    def is_push_due(self, obligations: list[str], time: datetime) -> bool:
        resting = self.subscription_failed_at is not None and time - self.subscription_failed_at < self.NOTIFICATION_RETRY_DELAY
        return self.has_updates(obligations) and not resting

    def subscribed(self, endpoint: str, obligations: list[str]) -> "Phone":
        return self.with_(subscription=endpoint, pushed=" ".join(obligations))

    def notified(self, obligations: list[str]) -> "Phone":
        return self.with_(pushed=" ".join(obligations), subscription_failed_at=None)

    def push_failed(self, time: datetime) -> "Phone":
        return self.with_(subscription_failed_at=time)

    def unsubscribed(self) -> "Phone":
        return self.with_(subscription="", subscription_failed_at=None)

    def ended(self, time: datetime) -> "Phone":
        return self.with_(ended_at=time)
