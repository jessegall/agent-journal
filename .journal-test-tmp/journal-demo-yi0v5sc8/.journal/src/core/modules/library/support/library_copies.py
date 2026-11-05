from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.library.support.copy_status import CopyStatus


@dataclass(frozen=True)
class LibraryCopies:
    """The copies of this journal with their statuses, as the copies command prints them."""

    statuses: tuple[CopyStatus, ...]

    def lines(self) -> Sequence[str]:
        return [line for status in self.statuses for line in status.lines()] or ["no copies follow an item of the library"]

    def json(self) -> Mapping[str, object]:
        return {"rows": [status.json() for status in self.statuses]}
