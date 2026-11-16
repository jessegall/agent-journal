from dataclasses import dataclass


@dataclass(frozen=True)
class SuiteRefusal:
    """One line of a suite's folder that breaks the engine's contract: the file, the line and why."""

    file: str
    line: int
    reason: str

    @property
    def text(self) -> str:
        return f"{self.file}:{self.line}: {self.reason}"
