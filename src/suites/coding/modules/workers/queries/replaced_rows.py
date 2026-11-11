"""Gives a kept list of rows without the row of one id, with the present rows in its place, in id order."""

from collections.abc import Sequence
from typing import TypeVar

from engine.model.model import Model

M = TypeVar("M", bound=Model)


def replaced_rows(rows: Sequence[M], row_id: int, present: Sequence[M]) -> tuple[M, ...]:
    return tuple(sorted([row for row in rows if row.id != row_id] + list(present), key=lambda row: row.id))
