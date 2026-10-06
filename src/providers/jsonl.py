import json
from pathlib import Path
from typing import Any, Callable, Iterable, Iterator, TypeVar

T = TypeVar("T")


def parsed(line: str, into: Callable[[Any], T]) -> T | None:
    try:
        return into(json.loads(line))
    except (ValueError, TypeError, KeyError, AttributeError):
        return None


def complete_lines(path: Path, offset: int) -> tuple[list[bytes], int]:
    try:
        with Path(path).open("rb") as source:
            source.seek(offset)
            raw = source.read()
    except (OSError, TypeError):
        return [], offset
    whole = raw[:raw.rfind(b"\n") + 1]
    return whole.split(b"\n")[:-1], offset + len(whole)


def last_lines(path: Path, span: int) -> tuple[list[bytes], int]:
    try:
        start = max(0, Path(path).stat().st_size - span)
    except (OSError, TypeError):
        return [], 0
    lines, end = complete_lines(path, start)
    return (lines[1:] if start else lines), end


def parsed_row(line: bytes, row_of: Callable[[dict], T]) -> T | None:
    raw = parsed(line.decode(errors="replace"), dict)
    return row_of(raw) if raw is not None else None


def rows(lines: Iterable[bytes], row_of: Callable[[dict], T]) -> Iterator[T]:
    return (found for found in (parsed_row(line, row_of) for line in lines) if found is not None)
