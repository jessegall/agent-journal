from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerSplitPreview:
    """The program, model and reason a task dispatch would use."""

    task_ids: tuple[int, ...]
    program: str
    model: str
    reason: str

    @property
    def line(self) -> str:
        tasks = ", ".join(f"task {task_id}" for task_id in self.task_ids)
        return f"{tasks} goes to {self.program} by {self.reason}, on {self.model}"
