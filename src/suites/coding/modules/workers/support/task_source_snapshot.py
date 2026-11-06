from dataclasses import dataclass

from core.modules.messages.support.work_source_snapshot import WorkSourceSnapshot


@dataclass(frozen=True)
class TaskSourceSnapshot:
    """A task and its request captured before preparing its assignment."""

    task_id: int
    source: WorkSourceSnapshot
