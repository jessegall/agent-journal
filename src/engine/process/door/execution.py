from dataclasses import dataclass


@dataclass(frozen=True)
class Execution:
    """How a run through the door ended: its process row, if one was kept, its exit code and what it printed."""

    process_id: int | None
    exit_code: int
    stdout: str
    stderr: str

    @property
    def succeeded(self) -> bool:
        return self.exit_code == 0
