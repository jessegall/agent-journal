import json
from bisect import bisect_right
from dataclasses import dataclass
from typing import Callable

from resources.base import Refused

PAGE = 50


@dataclass(frozen=True)
class Page:
    """One page of rows in an order, with where the next one starts and how many rows there are in all."""
    rows: list
    next: tuple | None
    total: int


def cursor_text(key: tuple | None) -> str:
    return json.dumps(list(key)) if key is not None else ""


def cursor_of(text: str | None) -> tuple | None:
    """The key a page ends at, as a client sent it back; none for no cursor, and a Refused for words that are no cursor."""
    if not text:
        return None
    try:
        found = json.loads(text)
    except ValueError:
        found = None
    if not isinstance(found, list) or not found:
        raise Refused(f"{text!r} is not a page cursor: ask for the first page without one, then pass back the cursor it gave")
    return tuple(found)


def paged(found: list, order: Callable, after: tuple | None = None, size: int = PAGE) -> Page:
    """The `size` items that follow the key a page before ended at, in `order`."""
    found = sorted(found, key=order)
    keys = [order(item) for item in found]
    start = bisect_right(keys, after) if after is not None else 0
    window = found[start:start + size]
    return Page(window, keys[start + len(window) - 1] if window and start + len(window) < len(found) else None, len(found))


def column_order(todo) -> tuple:
    """Where a to-do stands in its column: higher priority first, then the place it was dropped at, then its number; the key a board pages its lanes by."""
    return (-int(todo.priority), todo.position, todo.n)
