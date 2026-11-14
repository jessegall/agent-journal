import json
from dataclasses import asdict, dataclass

from suites.coding.modules.workers.support.phase_work import PhaseWork


@dataclass(frozen=True)
class WorkerAskFacts:
    """What the merger would otherwise dig for when a worker asks it something."""

    point: str
    task: int
    refusal: str | None
    outputs: tuple[str, ...]
    files: tuple[str, ...]
    phase: PhaseWork | None
    failed_checkpoint_output: str | None = None

    def json_text(self) -> str:
        return json.dumps(asdict(self))

    def text(self) -> str:
        files = ", ".join(self.files) if self.files else "none"
        refusal_lines = [] if self.refusal is None else [f"last refusal: {self.refusal}"]
        phase_lines = [] if self.phase is None else self.phase.lines()
        failed_lines = [] if self.failed_checkpoint_output is None else [f"failed checkpoint run: {self.failed_checkpoint_output}"]
        return "\n".join([f"point {self.point}, task {self.task}, files: {files}", *refusal_lines, *self.outputs, *phase_lines, *failed_lines])
