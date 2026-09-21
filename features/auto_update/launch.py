import os
import sys
from pathlib import Path

from engine.version import version
from features import FEATURES
from features.dev_faults.developing import developing
from surfaces.updates import fetched, newer


def latest_first(record) -> str:
    root = Path(record.root)
    feature = FEATURES.get("auto_update")
    if not feature or not feature.on(record, "install") or developing(root.parent):
        return ""
    cache = root / "runtime" / "upstream.cache"
    fetched(cache)
    latest = cache.read_text().strip() if cache.is_file() else ""
    if not newer(latest, version()):
        return ""
    from install import upgrade
    print(f"journal: installing {latest} before it starts", flush=True)
    failed = next((line for line in upgrade(root.parent, root) if "not refreshed" in line or "failed" in line), "")
    if failed:
        return failed
    os.execv(sys.executable, [sys.executable, str(root / "journal.py"), *sys.argv[1:]])
    return ""
