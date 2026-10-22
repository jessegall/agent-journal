from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model


@dataclass(frozen=True)
class IdBlock(Model):
    """A range of row numbers the team server handed this machine for one table, and the next of them a new row takes. Kept on this machine."""

    shared: ClassVar[bool] = False
    timeline_visible: ClassVar[bool] = False

    row_table: str = ""
    first_number: int = 0
    last_number: int = 0
    next_number: int = 0

    def spare_count(self) -> int:
        return self.last_number - self.next_number + 1

    def size(self) -> int:
        return self.last_number - self.first_number + 1

    def remainder(self) -> "IdBlock":
        return self.with_(next_number=self.next_number + 1)
