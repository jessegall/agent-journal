from dataclasses import dataclass
from datetime import datetime

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Share(Scoped):
    """A link that lets someone outside the journal read one document, report or plan and nothing else; what it opens is linked to it as shares."""

    token: str = ""
    expires_at: datetime | None = None
    approved: bool = False
    password: str = ""
    comments: bool = False
    views: int = 0
    stopped_at: datetime | None = None

    def opened(self) -> "Share":
        return self.with_(approved=True)

    def stopped(self, time: datetime) -> "Share":
        return self.with_(stopped_at=time)

    def viewed(self) -> "Share":
        return self.with_(views=self.views + 1)

    def is_active(self, time: datetime) -> bool:
        return self.stopped_at is None and (self.expires_at is None or self.expires_at > time)

    def opens(self, time: datetime) -> bool:
        return self.approved and self.is_active(time)
