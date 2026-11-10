from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class TaskWait(Model):
    """What a blocked task waits on: a row, written table:id, or a command run on an interval; the task opens
    once all its waits have ended."""

    model_name = "task_wait"
    cli_name = "task-wait"

    task_id: int
    creator_id: int
    target: str = ""
    command: str = ""
    interval_minutes: int = 0
    ended_at: Timestamp | None = None
