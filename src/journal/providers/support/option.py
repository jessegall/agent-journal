from dataclasses import dataclass


@dataclass(frozen=True)
class Option:
    number: int
    label: str
    cursor: bool
