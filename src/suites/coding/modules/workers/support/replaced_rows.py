from collections.abc import Sequence
from typing import TypeVar

from engine.model.model import Model

M = TypeVar("M", bound=Model)


def replaced_rows(rows: Sequence[M], row_id: int, present: Sequence[M]) -> tuple[M, ...]:
    """The rows without the one with this id, and the present ones in its place, in id order."""
    return tuple(sorted([row for row in rows if row.id != row_id] + list(present), key=lambda row: row.id))
