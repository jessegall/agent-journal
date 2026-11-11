from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerRunWindow:
    """The window of one checkpoint whose open tasks are all one worker's and all committed: the plan, the
    checkpoint phase and the tasks its run tests."""

    plan_id: int
    checkpoint_id: int
    task_ids: tuple[int, ...]
