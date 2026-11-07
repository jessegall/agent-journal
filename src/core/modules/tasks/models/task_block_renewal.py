from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class TaskBlockRenewal(Model):
    """The written reason for blocking or renewing a blocked task."""

    model_name = "task_block_renewal"
    cli_name = "task-block-renewal"

    task_id: int
    creator_id: int
    task_version: int
    reason: str
