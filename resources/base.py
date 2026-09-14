from __future__ import annotations

from dataclasses import dataclass, field, fields
from pathlib import Path
from typing import Callable, ClassVar, Generic, Iterable, Iterator, TypeVar

import fmt
from templates import render

MESSAGES = {
    "bad_sort": "{resource} cannot be sorted by {field}; it sorts by {fields:, }",
    "bad_direction": "a direction is asc or desc, got {direction}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


M = TypeVar("M", bound="Model")


@dataclass
class Model:
    n: int
    at: str = ""
    raw: dict = field(default_factory=dict, repr=False, compare=False)

    noun: ClassVar[str] = "resource"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at")

    @classmethod
    def of(cls: type[M], n: int, row: dict) -> M:
        names = {f.name for f in fields(cls)} - {"n", "raw"}
        return cls(n=n, raw=row, **{k: v for k, v in row.items() if k in names and v is not None})


def _blank(value) -> bool:
    return value is None or value == "" or value == []


@dataclass
class Page(Generic[M]):
    rows: list[M]
    left: int
    total: int


class Query(Generic[M]):
    def __init__(self, model: type[M], items: Iterable[M]):
        self.model, self._items = model, list(items)

    def __iter__(self) -> Iterator[M]:
        return iter(self._items)

    def where(self, test: Callable[[M], bool] | None = None, **equal) -> Query[M]:
        return Query(self.model, [i for i in self._items
                                  if (test is None or test(i)) and all(getattr(i, k) == v for k, v in equal.items())])

    def order_by(self, name: str, direction: str = fmt.ASC) -> Query[M]:
        if name not in self.model.sortable:
            raise ValueError(say("bad_sort", resource=self.model.noun, field=repr(name), fields=list(self.model.sortable)))
        if direction not in fmt.ORDERS:
            raise ValueError(say("bad_direction", direction=repr(direction)))
        # a blank value sorts last in either direction
        filled = [i for i in self._items if not _blank(getattr(i, name))]
        blank = [i for i in self._items if _blank(getattr(i, name))]
        return Query(self.model, sorted(filled, key=lambda i: getattr(i, name), reverse=direction == fmt.DESC) + blank)

    def get(self) -> list[M]:
        return list(self._items)

    def first(self) -> M | None:
        return self._items[0] if self._items else None

    def count(self) -> int:
        return len(self._items)

    def page(self, cap: int | None, number: int = 1) -> Page[M]:
        total = len(self._items)
        if not cap:
            return Page(self.get(), 0, total)
        start = (max(number, 1) - 1) * cap
        return Page(self._items[start:start + cap], max(0, total - start - cap), total)


class Repository(Generic[M]):
    model: ClassVar[type] = Model

    def __init__(self, root: Path, env: str = ""):
        self.root, self.env = root, env

    def rows(self) -> list[dict]:
        raise NotImplementedError

    def numbered(self) -> Iterable[tuple[int, dict]]:
        return enumerate(self.rows(), 1)

    def all(self) -> list[M]:
        return [self.model.of(n, row) for n, row in self.numbered()]

    def query(self) -> Query[M]:
        # an item whose content was removed after its retention is kept for numbering, never listed
        return Query(self.model, [m for m in self.all() if not m.raw.get("removed")])

    def find(self, n: int) -> M | None:
        return next((m for m in self.all() if m.n == n), None)

    def exists(self, n: int) -> bool:
        return self.find(n) is not None

    def count(self) -> int:
        return len(self.rows())
