from collections.abc import Mapping, Sequence
from typing import Protocol, runtime_checkable


@runtime_checkable
class RowsValue(Protocol):
    """A read's answer that lists rows and has its own JSON form."""

    @property
    def rows(self) -> Sequence[Mapping[str, object]]:
        raise NotImplementedError

    def json(self) -> Mapping[str, object]:
        raise NotImplementedError
