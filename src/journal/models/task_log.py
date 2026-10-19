from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class TaskLog(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("line",)

    task_id: int = 0
    line: str = ""

