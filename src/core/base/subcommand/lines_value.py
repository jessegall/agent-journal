from collections.abc import Mapping, Sequence
from typing import Protocol, runtime_checkable


@runtime_checkable
class LinesValue(Protocol):
    """A read's answer that prints as its own lines and has its own JSON form."""

    def lines(self) -> Sequence[str]:
        raise NotImplementedError

    def json(self) -> Mapping[str, object]:
        raise NotImplementedError
