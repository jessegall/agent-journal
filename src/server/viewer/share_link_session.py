import json
from dataclasses import dataclass
from datetime import datetime, timezone

from core.base.timestamp import Timestamp
from server.viewer.shared_row import SharedRow

ACTIVE = "active"


@dataclass(frozen=True)
class ShareLinkSession:
    """The share link a cookie's token belongs to, as the sharing module answers it: whose it is, what state
    it is in, when it ends and the row it shows."""

    id: int
    creator_id: int
    state: str
    expires_at: Timestamp
    shared: SharedRow

    @classmethod
    def parsed(cls, text: str) -> "ShareLinkSession":
        row = json.loads(text)
        return cls(int(row["id"]), int(row["creator_id"]), str(row["state"]), Timestamp.parsed(str(row["expires_at"])),
                   SharedRow(str(row["row_model"]), int(row["row_id"]), int(row["environment_id"])))

    def is_open(self) -> bool:
        return self.state == ACTIVE and self.expires_at.value > datetime.now(timezone.utc)
