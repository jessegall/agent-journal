from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class TaskLog(Scoped):
    task_id: int = 0
    line: str = ""

    def mentioning_text(self) -> str | None:
        return self.line
