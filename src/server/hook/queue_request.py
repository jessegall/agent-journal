from dataclasses import dataclass
from time import monotonic

from core.base.request_queue_entry import RequestQueueEntry


@dataclass(frozen=True)
class QueueRequest:
    sender: str
    event: str
    session: str
    queued_at: float
    priority: str = ""

    @classmethod
    def started(cls, sender: str, event: str, session: str = "", priority: str = "") -> "QueueRequest":
        return cls(sender, event, session, monotonic(), priority)

    def entry(self) -> RequestQueueEntry:
        return RequestQueueEntry(self.sender, self.event, self.session, (monotonic() - self.queued_at) * 1000, self.priority)
