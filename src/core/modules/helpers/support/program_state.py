from dataclasses import dataclass

from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class ProgramState:
    """Whether a program can take a new agent, with a reason and optional end time."""

    is_ready: bool
    line: str
    ends_at: Timestamp | None = None

    @classmethod
    def ready(cls) -> "ProgramState":
        return cls(True, "ready")

    @classmethod
    def unavailable(cls, line: str, ends_at: Timestamp | None = None) -> "ProgramState":
        return cls(False, line, ends_at)

    @property
    def ends_text(self) -> str | None:
        return self.ends_at.text if self.ends_at is not None else None

    def listed(self) -> dict[str, object]:
        return {"is_ready": self.is_ready, "line": self.line, "ends_at": self.ends_text}

    @property
    def wait_line(self) -> str:
        return f"{self.line}, until {self.ends_at.text}" if self.ends_at is not None else self.line
