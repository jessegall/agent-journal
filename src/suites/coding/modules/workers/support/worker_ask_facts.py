import json
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class WorkerAskFacts:
    """What the merger would otherwise dig for when a worker asks it something."""

    point: str
    task: int
    refusal: str | None
    outputs: tuple[str, ...]
    files: tuple[str, ...]

    def json_text(self) -> str:
        return json.dumps(asdict(self))

    def text(self) -> str:
        files = ", ".join(self.files) if self.files else "none"
        refusal_lines = [] if self.refusal is None else [f"last refusal: {self.refusal}"]
        return "\n".join([f"point {self.point}, task {self.task}, files: {files}", *refusal_lines, *self.outputs])
