from dataclasses import dataclass
from datetime import datetime

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class PairingCode(Scoped):
    """A code the user shows to pair one phone: its link and its short form kept only as hashes, open for minutes, used once, voided after too many wrong tries."""

    MOST_TRIES = 10

    code: str = ""
    short: str = ""
    days: int = 7
    until: datetime | None = None
    tries: int = 0
    closed_at: datetime | None = None

    def is_open(self, now: datetime) -> bool:
        return self.closed_at is None and self.until is not None and self.until > now

    def tried(self, time: datetime) -> "PairingCode":
        tries = self.tries + 1
        return self.with_(tries=tries, closed_at=time if tries >= self.MOST_TRIES else self.closed_at)

    def closed(self, time: datetime) -> "PairingCode":
        return self.with_(closed_at=time)
