from dataclasses import dataclass


@dataclass(frozen=True)
class CheckTask:
    """The task a check titled as its wait names, and whether that task is still blocked."""

    task_id: int | None
    is_blocked: bool
    is_titled: bool = False
