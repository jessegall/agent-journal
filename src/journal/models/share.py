from dataclasses import dataclass
from datetime import datetime

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Share(Scoped):
    """A link that lets someone outside the journal read one document, report or plan and nothing else; what it opens is linked to it as shares."""

    token: str = ""
    expires_at: datetime | None = None
    """When the link stops opening; none for a link that never ends."""
    approved: bool = False
    """Opened by the user; a link the agent made waits for their Accept."""
    password: str = ""
    """The password's salted hash; empty for a link that asks for none."""
    comments: bool = False
    views: int = 0
    stopped_at: datetime | None = None

    def opened(self) -> "Share":
        return self.with_(approved=True)

    def stopped(self, at: datetime) -> "Share":
        return self.with_(stopped_at=at)

    def viewed(self) -> "Share":
        return self.with_(views=self.views + 1)

    def is_live(self, now: datetime) -> bool:
        """Not stopped and not past its end: it opens once it is approved."""
        return self.stopped_at is None and (self.expires_at is None or self.expires_at > now)

    def opens(self, now: datetime) -> bool:
        return self.approved and self.is_live(now)
