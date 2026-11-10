from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class WorkerTaskSource(EnvironmentScoped, Model):
    """The request captured for one assigned task or delivered follow-up."""

    model_name = "worker_task_source"
    cli_name = "worker-task-source"

    creator_id: int
    worktree_id: int
    task_id: int
    environment_id: int = 0
    source_message_id: int | None = None
    source_version: int = 0
    source_unavailable: bool = False
    source_line_id: int | None = None
    started_at: Timestamp | None = None
