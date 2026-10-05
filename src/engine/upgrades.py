import threading
import time
from pathlib import Path

from engine import runtime
from engine.stored import write_text
from install import fetch, released, version_key

__all__ = ["fetch"]

UPSTREAM_FOR = 900
FETCHING = threading.Lock()


def stale(root: Path) -> bool:
    try:
        return time.time() - runtime.upstream_cache(root).stat().st_mtime >= UPSTREAM_FOR
    except OSError:
        return True


def upstream(root: Path) -> str:
    cache = runtime.upstream_cache(root)
    try:
        held = cache.read_text().strip()
    except OSError:
        held = ""
    if stale(root) and not FETCHING.locked():
        threading.Thread(target=fetched, args=(cache,), daemon=True).start()
    return held


def fetched(cache: Path) -> None:
    with FETCHING:
        kept_newest(cache)


def kept_newest(cache: Path) -> None:
    cache.parent.mkdir(parents=True, exist_ok=True)
    newest = released()
    if not newest:
        cache.touch(exist_ok=True)
        return
    write_text(cache, newest)


def check_now(root: Path) -> None:
    if not FETCHING.acquire(blocking=False):
        return

    def check() -> None:
        try:
            kept_newest(runtime.upstream_cache(root))
        finally:
            FETCHING.release()

    threading.Thread(target=check, daemon=True).start()


def newer(version: str, than: str) -> bool:
    return bool(version) and (not than or than == "0" or version_key(version) > version_key(than))
