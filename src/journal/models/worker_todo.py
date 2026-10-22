from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class WorkerTodo(Scoped):
    """One item of the to-do list a worker keeps inside its task, linked to the task, in the order it was written."""

    text_fields: ClassVar[tuple[str, ...]] = ("text",)

    position: int = 0
    text: str = ""
    complete: bool = False

    def completed(self) -> "WorkerTodo":
        return self.with_(complete=True)
