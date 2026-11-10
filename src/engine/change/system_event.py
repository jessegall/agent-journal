from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True)
class SystemEvent:
    """An event of the journal itself, which no row carries, known by its name."""

    name: ClassVar[str]
