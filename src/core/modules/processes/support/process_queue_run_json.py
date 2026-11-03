from typing import TypedDict


class ProcessQueueRunJson(TypedDict):
    """The fields of one run in the process queue response."""

    id: int
    agent_id: int
    worker_id: int | None
    category: str
    line: str
    state: str
    is_queued: bool
    output_id: int
