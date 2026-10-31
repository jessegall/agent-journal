from dataclasses import dataclass
from enum import StrEnum


@dataclass(frozen=True)
class Move:
    """One step a row's state may take: from which states, to which state, and the name a person types for it."""

    name: str
    sources: tuple[StrEnum, ...]
    target: StrEnum
