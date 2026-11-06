from dataclasses import dataclass

from core.base.request_queue_entry import RequestQueueEntry


@dataclass(frozen=True)
class RequestQueueStatus:
    running: tuple[RequestQueueEntry, ...]
    waiting: tuple[RequestQueueEntry, ...]
    hook_limit: int
    viewer_wait_seconds: float
    main_hook_seconds: float
    agent_hook_seconds: float

