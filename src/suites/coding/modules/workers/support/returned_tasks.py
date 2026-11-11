from dataclasses import dataclass


@dataclass(frozen=True)
class ReturnedTasks:
    """The tasks a failed checkpoint run gives back to one worker, with the outputs of the tests that failed
    for them."""

    worker_id: int
    task_ids: tuple[int, ...]
    output_ids: tuple[int, ...]
