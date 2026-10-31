from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class TaskLog(Model):
    """One line written on a task about where it stands; the lines are part of the task and go with it."""

    model_name = "task_log"
    cli_noun = "task-log"

    task_id: int
    creator_id: int
    line: str
