from dataclasses import dataclass
from typing import Generic, TypeIs, TypeVar

M = TypeVar("M")


@dataclass(frozen=True)
class Page(Generic[M]):
    """One page of a list: its rows, which page it is, how many rows a page holds, and how many rows there are
    in all."""

    rows: tuple[M, ...]
    number: int
    size: int
    total: int

    @property
    def is_last(self) -> bool:
        return self.number * self.size >= self.total


def is_page(value: object) -> TypeIs[Page[object]]:
    return isinstance(value, Page)
