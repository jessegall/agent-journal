import json
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path
from typing import Any, Callable, Iterable, Iterator, TypeVar

from engine import whole_reads

T = TypeVar("T")
FRESH_BYTES = 64_000_000


def parsed(line: str, into: Callable[[Any], T]) -> T | None:
    try:
        return into(json.loads(line))
    except (ValueError, TypeError, KeyError, AttributeError):
        return None


class WholeRead(StrEnum):
    SEARCH = "a search through every conversation"


class ReadFromStart(Exception):
    @classmethod
    def refused(cls, path: Path) -> "ReadFromStart":
        return cls(f"{path} is read from a saved cursor or from its tail; a read from its first byte names its reason with whole_lines")


@dataclass(frozen=True)
class Read:
    lines: list[bytes]
    start: int
    end: int


def read_bytes(path: Path, start: int, stop: int | None = None) -> bytes:
    """The one place a transcript is opened."""
    try:
        with Path(path).open("rb") as source:
            source.seek(start)
            return source.read() if stop is None else source.read(max(0, stop - start))
    except (OSError, TypeError):
        return b""


def complete(path: Path, start: int, stop: int | None = None) -> Read:
    raw = read_bytes(path, start, stop)
    whole = raw[:raw.rfind(b"\n") + 1]
    return Read(whole.split(b"\n")[:-1], start, start + len(whole))


def lines_after(path: Path, cursor: int) -> Read:
    if cursor <= 0:
        raise ReadFromStart.refused(path)
    return complete(path, cursor)


def tail_lines(path: Path, span: int) -> Read:
    try:
        start = max(0, Path(path).stat().st_size - span)
    except (OSError, TypeError):
        return Read([], 0, 0)
    found = complete(path, start)
    if not start or not found.lines:
        return found
    return Read(found.lines[1:], start + len(found.lines[0]) + 1, found.end)


def head_lines(path: Path, span: int) -> Read:
    return complete(path, 0, span)


def lines_from(path: Path, cursor: int) -> Read:
    return lines_after(path, cursor) if cursor else tail_lines(path, FRESH_BYTES)


def whole_lines(path: Path, why: WholeRead) -> Read:
    whole_reads.note(why)
    return complete(path, 0)


def parsed_row(line: bytes, row_of: Callable[[dict], T]) -> T | None:
    raw = parsed(line.decode(errors="replace"), dict)
    return row_of(raw) if raw is not None else None


def rows(lines: Iterable[bytes], row_of: Callable[[dict], T]) -> Iterator[T]:
    return (found for found in (parsed_row(line, row_of) for line in lines) if found is not None)
