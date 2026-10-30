from dataclasses import dataclass
from enum import StrEnum


@dataclass(frozen=True)
class Move:
    """One way a state may change: its name, which is its subcommand and its event, the states it starts from and
    the state it leads to."""

    name: str
    sources: tuple[StrEnum, ...]
    target: StrEnum
