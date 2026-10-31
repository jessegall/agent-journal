import json
from dataclasses import dataclass
from datetime import datetime, timezone

from core.base.timestamp import Timestamp

ACTIVE = "active"


@dataclass(frozen=True)
class ShareLinkSession:
    """The share link a cookie's token belongs to, as the sharing module answers it: whose it is, what state
    it is in and when it ends."""

    id: int
    creator_id: int
    state: str
    expires_at: Timestamp

    @classmethod
    def parsed(cls, text: str) -> "ShareLinkSession":
        row = json.loads(text)
        return cls(int(row["id"]), int(row["creator_id"]), str(row["state"]), Timestamp.parsed(str(row["expires_at"])))

    def is_open(self) -> bool:
        return self.state == ACTIVE and self.expires_at.value > datetime.now(timezone.utc)
