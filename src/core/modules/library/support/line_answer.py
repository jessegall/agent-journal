from collections.abc import Mapping
from typing import Protocol, runtime_checkable


@runtime_checkable
class LineAnswer(Protocol):
    """An answer that prints as one text and has its own JSON form."""

    def line(self) -> str:
        raise NotImplementedError

    def json(self) -> Mapping[str, object]:
        raise NotImplementedError
