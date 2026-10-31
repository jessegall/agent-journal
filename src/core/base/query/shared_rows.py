from collections.abc import Sequence
from dataclasses import dataclass
from typing import ClassVar

from core.base.model.model import Model


@dataclass(frozen=True)
class ModelRowIds:
    """The ids of one model that a shared row includes."""

    model: str
    ids: Sequence[int]


class SharedRows:
    """The rows a share link to one row includes, which its module declares: for a plan, its phases and tasks."""

    row: ClassVar[type[Model]]

    def rows(self, row_id: int) -> Sequence[ModelRowIds]:
        raise NotImplementedError
