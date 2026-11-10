from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class HookTranscript:
    """Where the program of one hook keeps its session's transcript."""

    program: str
    firing: str
    text: str

    @property
    def path(self) -> Path | None:
        return Path(self.text).expanduser() if self.text else None
