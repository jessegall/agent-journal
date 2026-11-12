from typing import TypedDict


class ProcessCardJsonRecord(TypedDict):
    """The JSON form of ProcessCard.json."""

    id: int
    line: str
    state: str
    progress: int
    created_at: str | None
    ended_at: str | None
    title: str
    steps_passed: int
    steps_failed: int
    summary: str
    agent_id: int
    reads_progress: bool
    reader_requested: bool
    reading_text: str | None
    marked_words: str
    markable: bool
