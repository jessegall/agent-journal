"""When a file was last written, and which of a set of files are older than an age. Every layer that tidies after itself needs both, so neither belongs to one of them."""

import time
from pathlib import Path

from resources.base import names

RUNTIME = "runtime"
KIND = names("edited", "created", "deleted")
IMAGE_SUFFIXES = (".png", ".gif", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".bmp")


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


def is_image(path: str) -> bool:
    return path.lower().endswith(IMAGE_SUFFIXES)


def start_name(env: str, compacted: bool = False) -> str:
    """Where the start block of an environment is kept, under the journal's folder."""
    return f"{RUNTIME}/{'compact' if compacted else 'start'}-{env}.md"
