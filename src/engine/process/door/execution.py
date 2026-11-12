from dataclasses import dataclass


@dataclass(frozen=True)
class Execution:
    """How a run through the door ended: its process row, if one was kept, its exit code and what it printed."""

    process_id: int | None
    exit_code: int
    stdout: str
    stderr: str

    @classmethod
    def failed(cls, process_id: int | None, exit_code: int, reason: str) -> "Execution":
        return cls(process_id, exit_code, stdout="", stderr=reason)

    @classmethod
    def printed(cls, process_id: int | None, exit_code: int, output: str) -> "Execution":
        return cls(process_id, exit_code, stdout=output, stderr="")

    @property
    def succeeded(self) -> bool:
        return self.exit_code == 0
