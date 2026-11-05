from collections.abc import Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class ModelRowIds:
    """The ids of one model that a shared row includes."""

    model: str
    ids: Sequence[int]
