from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path

from engine.enums.process_kind import ProcessKind


@dataclass(frozen=True)
class ExecutionRequest:
    """A program the journal is asked to run through its one door: its words, the folder it runs in, its kind and
    how long it may run."""

    line: Sequence[str]
    folder: Path
    kind: ProcessKind
    limit_seconds: float
    title: str = ""
    stdin: str | None = None
    variables: Mapping[str, str] | None = None
    on_line: Callable[[str], None] | None = None

    @property
    def text(self) -> str:
        return " ".join(self.line)
