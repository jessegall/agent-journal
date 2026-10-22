from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model


@dataclass(frozen=True)
class PendingUpload(Model):
    """A file attached on this machine that the team server does not have yet: its row's table and number and its name. Kept on this machine."""

    shared: ClassVar[bool] = False
    timeline_visible: ClassVar[bool] = False

    row_table: str = ""
    row: int = 0
    name: str = ""
