from dataclasses import dataclass


@dataclass(frozen=True)
class TaskComment:
    """A comment on a task: the number of the message that holds it and its text."""

    message_id: int
    text: str
    next_command: str | None = None
