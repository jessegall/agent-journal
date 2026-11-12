from typing import TypedDict

from core.modules.tasks.support.task_block_renewal_record import TaskBlockRenewalRecord
from core.modules.tasks.support.task_log_record import TaskLogRecord
from core.modules.tasks.support.task_wait_record import TaskWaitRecord


class TaskInspectionJsonRecord(TypedDict):
    """The JSON form of TaskInspection.json."""

    id: int
    title: str
    brief: str
    state: str
    priority: int
    complexity: int | None
    tags: list[str]
    reason: str
    outcome: str
    holder_id: int | None
    helper_id: int | None
    helper_name: str | None
    helper_main: bool
    created_at: str
    updated_at: str
    openers: list[str]
    waits: list[TaskWaitRecord]
    logs: list[TaskLogRecord]
    block_renewals: list[TaskBlockRenewalRecord]
