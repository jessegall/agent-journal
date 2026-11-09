import re
from collections.abc import Sequence
from dataclasses import dataclass

WORKER_TRAILER = re.compile(r"Journal: worker worker-(\d+)")


@dataclass(frozen=True)
class TaskBranchCommit:
    """A commit on a worker's branch: its short id, its first line and the worker its trailer names."""

    short_id: str
    subject: str
    worker_id: int | None

    @classmethod
    def parsed(cls, short_id: str, message: str) -> "TaskBranchCommit":
        trailer = WORKER_TRAILER.search(message)
        return cls(short_id, message.splitlines()[0], int(trailer.group(1)) if trailer is not None else None)

    def has_task_subject(self, task_ids: Sequence[int]) -> bool:
        return any(self.subject.startswith(f"task {task_id}: ") for task_id in task_ids)
