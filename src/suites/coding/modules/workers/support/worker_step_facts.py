from dataclasses import dataclass

from suites.coding.modules.workers.support.missing_points import MissingPoints
from suites.coding.modules.workers.support.step_fields import StepFields

UNLIMITED_TEXT = "no limit"
COMMIT_COMMAND = "journal worker commit"
COMMIT_TEXT = "the journal judges what is staged and tests it on your commit"
PLANNED_COMMIT_TEXT = "the journal judges what is staged and commits it; the tests run at the checkpoint"


def run_count_text(test_runs_available: int | None) -> str:
    return UNLIMITED_TEXT if test_runs_available is None else str(test_runs_available)


@dataclass(frozen=True)
class WorkerStepFacts:
    """What the sentence of a worker's point needs to know: its task, what is open, and how it hands in."""

    task_id: int
    open_task_count: int
    test_runs_available: int | None
    label: str
    conflict_files: str = ""
    tests_waiting: bool = False
    checkpoint_wait: str | None = None
    ready_task_ids: tuple[int, ...] = ()
    open_task_ids: tuple[int, ...] = ()
    missing: MissingPoints | None = None
    is_planned: bool = False
    unit_open_count: int | None = None

    @property
    def waiting_text(self) -> str:
        if self.checkpoint_wait is not None:
            return self.checkpoint_wait
        return f"The tests of {self.label} are queued." if self.tests_waiting else f"{self.label} is committed."

    @property
    def proven_text(self) -> str:
        ids = ", ".join(str(task_id) for task_id in self.ready_task_ids)
        return f"Task {ids} is" if len(self.ready_task_ids) == 1 else f"Tasks {ids} are"

    @property
    def commit_text(self) -> str:
        if not self.open_task_ids:
            return COMMIT_COMMAND
        return f"{COMMIT_COMMAND}, or go on with {', '.join(str(task_id) for task_id in self.open_task_ids)}"

    @property
    def missing_text(self) -> str:
        if self.missing is None or not self.missing.points:
            return ""
        return f": {self.missing.points_text()}"

    @property
    def unit_open_text(self) -> str:
        return "" if self.unit_open_count is None else f", {self.unit_open_count} left in your unit"

    def words(self) -> StepFields:
        return StepFields(waiting=self.waiting_text, task=self.task_id, open_tasks=f"{self.open_task_count} task(s)", runs=run_count_text(self.test_runs_available), label=self.label,
                         files=self.conflict_files, proven=self.proven_text, commit=self.commit_text,
                         commit_tests=PLANNED_COMMIT_TEXT if self.is_planned else COMMIT_TEXT, missing=self.missing_text, unit_open=self.unit_open_text)
