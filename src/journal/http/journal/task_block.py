from dataclasses import dataclass


@dataclass(frozen=True)
class TaskBlock:
    """The task an environment's live agent holds, and what it waits for on it while a pause stands on top."""

    id: int
    title: str
    wait_text: str
