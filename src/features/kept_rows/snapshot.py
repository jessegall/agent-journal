import os
import pickle
import re
from pathlib import Path

from controllers.stored import HELD, rolling
from engine import runtime
from engine.upgrades import newer
from engine.version import version
from resources.types import TYPES

SNAPSHOT = "rows.snapshot"
FULL_RESTART = "<!-- full-restart -->"


def snapshot_file(root: Path) -> Path:
    return runtime.folder(root) / SNAPSHOT


def needs_full_restart(changes: str, built: str) -> bool:
    """Whether a release after the build that wrote the snapshot says in its changelog entry that everything is to be read again."""
    return any(FULL_RESTART in entry and newer(entry.split()[0], built) for entry in re.split(r"^## ", changes, flags=re.M)[1:])


def write(root: Path) -> None:
    """Writes the rows every folder of the record holds in memory, the one used longest ago first, each pickled alone so that one that will not read back costs only itself."""
    prefix = str(root) + os.sep
    folders = {}
    for folder, memo in list(HELD.items()):
        resource = TYPES.get(Path(folder).name)
        if resource is None or not folder.startswith(prefix):
            continue
        rows = []
        for key, (stamp, row) in list(memo.held.items()):
            try:
                rows.append((key, stamp, pickle.dumps(row)))
            except Exception:
                continue
        folders[folder] = (resource.version, rows)
    where = snapshot_file(root)
    where.parent.mkdir(parents=True, exist_ok=True)
    temporary = where.with_suffix(".tmp")
    temporary.write_bytes(pickle.dumps({"built": version(), "folders": folders}))
    os.replace(temporary, where)


def read(root: Path, changes: str) -> int:
    """Puts back the rows the last server wrote, leaving out a type whose version changed, a row that will not read back and all of it when a release asks for a full restart; the snapshot is gone once read."""
    where = snapshot_file(root)
    try:
        raw = where.read_bytes()
    except OSError:
        return 0
    where.unlink(missing_ok=True)
    try:
        kept = pickle.loads(raw)
        built, folders = kept["built"], kept["folders"]
    except Exception:
        return 0
    if needs_full_restart(changes, built):
        return 0
    restored = 0
    for folder, (was, rows) in folders.items():
        resource = TYPES.get(Path(folder).name)
        if resource is None or resource.version != was:
            continue
        memo = rolling(folder, resource.held)
        for key, stamp, blob in rows:
            try:
                memo.put(key, stamp, pickle.loads(blob))
            except Exception:
                continue
            restored += 1
    return restored
