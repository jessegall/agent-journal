from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerTask:
    """A task a worker holds, by its number and the worker's: only the worker's merge closes it."""

    task: int
    worker: int
