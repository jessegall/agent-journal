import json
from dataclasses import dataclass

from engine.time.timestamp import Timestamp
from server.viewer.shared_row import SharedRow

ACTIVE = "active"


@dataclass(frozen=True)
class ShareLinkSession:
    """The share link a cookie's token belongs to, as the sharing module answers it: whose it is, what state
    it is in, when it ends, if it does, the row it shows, whether visitors may comment and whether it asks for
    a password."""

    id: int
    creator_id: int
    state: str
    expires_at: Timestamp | None
    shared: SharedRow
    comments: bool
    locked: bool

    @classmethod
    def parsed(cls, text: str) -> "ShareLinkSession":
        row = json.loads(text)
        return cls(int(row["id"]), int(row["creator_id"]), str(row["state"]), Timestamp.parsed(str(row["expires_at"])) if row["expires_at"] else None,
                   SharedRow(str(row["row_model"]), int(row["row_id"]), int(row["environment_id"])), bool(row["comments"]), bool(row["locked"]))

    def is_open(self, now: Timestamp) -> bool:
        return self.state == ACTIVE and (self.expires_at is None or self.expires_at > now)
