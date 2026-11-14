from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerSplitProblem:
    """Why a task preview cannot choose a program and model."""

    task_ids: tuple[int, ...]
    reason: str

    @property
    def line(self) -> str:
        return self.reason
