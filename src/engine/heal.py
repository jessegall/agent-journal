import time
from pathlib import Path

from engine.package import point
from engine.stored import read_json, write_json


REFUSED_FOR = 12 * 3600


def ledger(root: Path) -> Path:
    return Path(root) / "runtime" / "broken.json"


def broken(root: Path) -> list[str]:
    return list(read_json(ledger(root), {}).get("builds") or [])


def refused(root: Path, version: str) -> bool:
    since = read_json(ledger(root), {}).get("at") or {}
    return any(name.startswith(f"journal-{version}-") and time.time() - since.get(name, 0) < REFUSED_FOR for name in broken(root))


def heal(root: Path) -> str:
    root = Path(root)
    current = (root / "journal.pyz").resolve()
    bad = sorted({*broken(root), current.name})
    kept = [build for build in root.glob("journal-*.pyz") if build.name not in bad]
    if not kept:
        return ""
    previous = max(kept, key=lambda build: build.stat().st_mtime)
    at = {**(read_json(ledger(root), {}).get("at") or {}), current.name: time.time()}
    write_json(ledger(root), {"builds": bad, "at": at})
    point(root, previous)
    return f"journal: {current.name} would not start, so the journal went back to {previous.name}"
