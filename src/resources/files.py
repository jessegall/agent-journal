"""When a file was last written, and which of a set of files are older than an age. Every layer that tidies after itself needs both, so neither belongs to one of them."""

import time
from pathlib import Path

from resources.base import names

KIND = names("edited", "created", "deleted")


def mtime(path: Path) -> int:
    """When the file was last written, in nanoseconds, or zero when there is no reading it."""
    try:
        return path.stat().st_mtime_ns
    except OSError:
        return 0


def older(paths, age: float) -> list[Path]:
    """Of these paths, the ones last written more than that many seconds ago."""
    now = time.time()
    return [path for path in paths if mtime(path) and now - mtime(path) / 1e9 > age]
