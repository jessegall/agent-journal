from typing import ClassVar
from dataclasses import dataclass, field
from datetime import datetime

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class PhoneCode(Scoped):
    """A code the user shows to pair one phone: its link and its short form kept only as hashes, open for minutes, used once, voided after too many wrong tries."""

    shared: ClassVar[bool] = False

    MAXIMUM_ATTEMPTS = 10

    code: str = ""
    short: str = ""
    days: int = 7
    expires_at: datetime = field(kw_only=True)
    tries: int = 0
    closed_at: datetime | None = None

    def is_open(self, time: datetime) -> bool:
        return self.closed_at is None and self.expires_at > time

    def tried(self, time: datetime) -> "PhoneCode":
        tries = self.tries + 1
        return self.with_(tries=tries, closed_at=time if tries >= self.MAXIMUM_ATTEMPTS else self.closed_at)

    def closed(self, time: datetime) -> "PhoneCode":
        return self.with_(closed_at=time)
