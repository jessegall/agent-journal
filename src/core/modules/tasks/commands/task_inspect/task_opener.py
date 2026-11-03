from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class TaskOpener:
    """What opens a blocked task: a command that passes, or a row that is settled."""

    target: str
    command: str

    @classmethod
    def parsed(cls, wait: Mapping[str, str]) -> "TaskOpener":
        return cls(wait["target"], wait["command"])

    @property
    def text(self) -> str:
        if self.command:
            return f"{self.command} passes"
        target_model, _, target_id = self.target.partition(":")
        return f"{target_model.removesuffix('s')} {target_id} is settled"
