import threading
import time
from pathlib import Path
from urllib.request import urlopen

from controllers.types import Notifications
from engine.hooks import default_env
from engine.record import Record
from resources.base import SYSTEM
from engine.stored import write_text
from engine.version import version as package_version

PACKAGE = Path(__file__).resolve().parents[1]
KIND = "update"


def counted(version: str) -> tuple:
    return tuple(int(part) if part.isdigit() else 0 for part in str(version).split("."))


def newer(version: str, than: str) -> bool:
    return bool(version and than) and counted(version) > counted(than)


def announce(root: Path, version: str = "") -> str:
    version = version or package_version()
    seen = Path(root) / "runtime" / "version"
    before = seen.read_text().strip() if seen.is_file() else ""
    if before == version:
        return ""
    seen.parent.mkdir(parents=True, exist_ok=True)
    write_text(seen, version)
    if not before:
        return ""
    record = Record(Path(root), default_env(Path(root)))
    Notifications(record, actor=SYSTEM)._logged(f"Journal updated to {version}", brief=f"The journal went from {before} to {version}.",
                                               kind=KIND, version=version)
    return version


UPSTREAM = "https://raw.githubusercontent.com/jessegall/agent-journal/main/src/VERSION"


UPSTREAM_FOR = 900
FETCHING = threading.Lock()


def upstream(root: Path) -> str:
    cache = root / "runtime" / "upstream.cache"
    try:
        stale = time.time() - cache.stat().st_mtime >= UPSTREAM_FOR
        held = cache.read_text().strip()
    except OSError:
        stale, held = True, ""
    if stale and not FETCHING.locked():
        threading.Thread(target=fetched, args=(cache,), daemon=True).start()
    return held


def fetched(cache: Path) -> None:
    with FETCHING:
        try:
            with urlopen(UPSTREAM, timeout=3) as r:
                latest = r.read().decode().strip()
        except OSError:
            cache.parent.mkdir(parents=True, exist_ok=True)
            cache.touch(exist_ok=True)
            return
        cache.parent.mkdir(parents=True, exist_ok=True)
        write_text(cache, latest)
