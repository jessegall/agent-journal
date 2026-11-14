from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class FailedRun:
    """What failed in the run of a reached checkpoint: for each task the outputs of the failed tests that
    belong to it, and the task that got a failure that names no task, when there was one."""

    task_outputs: Mapping[int, tuple[int, ...]]
    fallback_task_id: int | None = None

    @property
    def task_ids(self) -> tuple[int, ...]:
        return tuple(sorted(self.task_outputs))

    def output_ids(self, task_ids: Sequence[int]) -> tuple[int, ...]:
        return tuple(dict.fromkeys(output_id for task_id in task_ids for output_id in self.task_outputs[task_id]))
