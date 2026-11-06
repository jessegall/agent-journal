from dataclasses import dataclass

from core.base.refusal import Refusal


@dataclass(frozen=True)
class RequestQueueEntry:
    sender: str
    event: str
    session: str
    waited_ms: float


@dataclass(frozen=True)
class RequestQueueSnapshot:
    running: tuple[RequestQueueEntry, ...]
    waiting: tuple[RequestQueueEntry, ...]
    hook_limit: int
    viewer_wait_seconds: float
    main_hook_seconds: float
    agent_hook_seconds: float


class RequestQueue:
    def snapshot(self) -> RequestQueueSnapshot:
        raise Refusal("the server queue is unavailable", "start the server to read the queue")
