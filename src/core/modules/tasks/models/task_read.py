from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class TaskRead(Model):
    """A task whose brief an agent read since its last compaction."""

    model_name = "task_read"
    cli_name = "task-read"

    task_id: int
    session_agent_id: int
    creator_id: int
