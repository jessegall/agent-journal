from pathlib import Path
from typing import NamedTuple

from providers.base import Whole
from providers.transcript_cache import CACHE, KEEP_TRANSCRIPT_EVERY, SEAM, shape_mark

SEARCH = "search"


class FoldKey(NamedTuple):
    kind: str
    path: str
    shape: str


def key(path: Path) -> FoldKey:
    return FoldKey(SEARCH, str(path), shape_mark())


def restored(path: Path, size: int) -> Whole | None:
    """The turns of a conversation an earlier run read and kept on disk, as long as the file still holds the bytes they were read from."""
    kept = CACHE.stored(key(path))
    if not kept:
        return None
    end, (lines, turns, seam) = kept
    if end > size or (seam and CACHE.before(path, end, len(seam)) != seam):
        return None
    return Whole(turns, end, lines)


def keep(path: Path, whole: Whole) -> None:
    """Keeps a conversation that has grown, now and then and off the request."""
    CACHE.keep(key(path), whole.end, (whole.lines, whole.turns, CACHE.before(path, whole.end, SEAM)), KEEP_TRANSCRIPT_EVERY, behind=True)


def write(path: Path, whole: Whole) -> None:
    CACHE.write(key(path), whole.end, (whole.lines, whole.turns, CACHE.before(path, whole.end, SEAM)))
