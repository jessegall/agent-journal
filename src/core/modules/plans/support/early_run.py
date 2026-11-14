from collections.abc import Mapping
from dataclasses import dataclass

EMPTY_RUN_LINE = "nothing to run: no task of the window is committed"
EARLY_LINE = "checkpoint of phase {phase}: the tests of tasks {tasks} run early"


@dataclass(frozen=True)
class EarlyRun:
    """What an early run of a checkpoint window started: the checkpoint phase and the tasks whose tests run,
    or nothing when no task of the window is in testing."""

    phase_id: int | None = None
    task_ids: tuple[int, ...] = ()

    @property
    def line(self) -> str:
        if self.phase_id is None:
            return EMPTY_RUN_LINE
        return EARLY_LINE.format(phase=self.phase_id, tasks=", ".join(map(str, self.task_ids)))

    def json(self) -> Mapping[str, object]:
        return {"phase_id": self.phase_id, "task_ids": list(self.task_ids)}
