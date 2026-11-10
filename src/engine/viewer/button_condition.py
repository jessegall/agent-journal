from collections.abc import Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class ButtonCondition:
    """Shows a button while a row field holds one of the listed values."""

    field: str
    values: Sequence[str]
