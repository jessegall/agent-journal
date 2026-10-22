from typing import ClassVar
from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class MigratedRow(Model):
    """A version 3 row brought across, by where it lay in the backup and the row it became, so a second run never brings it twice."""

    shared: ClassVar[bool] = False

    source: str = ""
    target: str = ""
