from typing import TypedDict


class ProcessCardJsonRecord(TypedDict):
    """The JSON form of ProcessCard.json."""

    id: object
    line: object
    state: object
    progress: object
    created_at: object
    ended_at: object
    title: object
    steps_passed: object
    steps_failed: object
    summary: object
    agent_id: object
    reads_progress: object
    reader_requested: object
