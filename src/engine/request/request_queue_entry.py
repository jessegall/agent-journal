from dataclasses import dataclass


@dataclass(frozen=True)
class RequestQueueEntry:
    sender: str
    event: str
    session: str
    waited_ms: float
    priority: str = ""


