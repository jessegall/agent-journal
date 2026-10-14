"""The row a call writes to and when the person pressing it last saw it change, held for the length of the call."""

from contextvars import ContextVar
from dataclasses import dataclass

UNCHANGED_SINCE = "unchanged_since"


@dataclass(frozen=True)
class Pressed:
    """The row a call writes to, and when it last changed as the person pressing it saw it."""

    type: str = ""
    n: int = 0
    updated: float = 0.0

    @classmethod
    def of(cls, type: str, n, given: dict) -> "Pressed":
        if UNCHANGED_SINCE not in given or n is None:
            return cls()
        return cls(type, int(n), float(given[UNCHANGED_SINCE]))

    def is_row(self, type: str, n: int) -> bool:
        return (self.type, self.n) == (type, n)


PRESSED: ContextVar[Pressed] = ContextVar("pressed", default=Pressed())
