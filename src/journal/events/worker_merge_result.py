from dataclasses import dataclass

from journal.events.worker_merge_event import WorkerMergeEvent


@dataclass(frozen=True, kw_only=True)
class WorkerMergeResult(WorkerMergeEvent):
    """A worker's branch was merged, with the commits it landed as the task's outcome names them."""

    commits: str
