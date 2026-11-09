from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class WorkerRefusalCount(Model):
    model_name = "worker_refusal_count"
    cli_name = "worker-refusal-count"
    shared_rows = True

    worktree_id: int
    creator_id: int
    notice_at: Timestamp | None = None
    refusal_text: str | None = None
