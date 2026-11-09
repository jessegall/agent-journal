from dataclasses import dataclass, replace

UNLIMITED_TEXT = "no limit"


def run_count_text(test_runs_available: int | None) -> str:
    return UNLIMITED_TEXT if test_runs_available is None else str(test_runs_available)


@dataclass(frozen=True)
class WorkerStepFacts:
    """What the sentence of a worker's point needs to know: its task, what is open, and how it hands in."""

    task_id: int
    open_task_count: int
    test_runs_available: int | None
    label: str
    deliver_command: str
    conflict_files: str = ""
    tests_waiting: bool = False

    def changed_deliver_command(self, command: str) -> "WorkerStepFacts":
        return replace(self, deliver_command=command)

    @property
    def waiting_text(self) -> str:
        return f"The tests of {self.label} are queued." if self.tests_waiting else f"{self.label} is handed in."

    def words(self) -> dict[str, object]:
        return {"waiting": self.waiting_text, "task": self.task_id, "open_tasks": f"{self.open_task_count} task(s)", "runs": run_count_text(self.test_runs_available), "label": self.label, "deliver": self.deliver_command, "files": self.conflict_files}
