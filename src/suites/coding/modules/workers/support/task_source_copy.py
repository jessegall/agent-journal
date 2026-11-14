from dataclasses import dataclass

from core.modules.messages.support.work_source_copy import WorkSourceCopy


@dataclass(frozen=True)
class TaskSourceCopy:
    """A task and its request captured before preparing its assignment."""

    task_id: int
    source: WorkSourceCopy
