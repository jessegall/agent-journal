from collections.abc import Mapping
from dataclasses import dataclass

USER_TARGET = "user"


@dataclass(frozen=True)
class TaskOpener:
    """What opens a blocked task: a command that passes, or a row that is settled."""

    target: str
    command: str
    last_run_at: str

    @classmethod
    def parsed(cls, wait: Mapping[str, str], last_run_at: str) -> "TaskOpener":
        return cls(wait["target"], wait["command"], last_run_at)

    @property
    def text(self) -> str:
        if self.command:
            attempt = f"last tried {self.last_run_at}" if self.last_run_at else "not tried yet"
            return f"{self.command} passes ({attempt})"
        if self.target == USER_TARGET:
            return "the user acts"
        target_model, _, target_id = self.target.partition(":")
        if target_model == "helpers":
            return f"helper {target_id.partition(':')[0]} reports"
        return f"{target_model.removesuffix('s')} {target_id} is settled"
