from pathlib import Path

from engine.package import point
from engine.stored import read_json, write_json


def ledger(root: Path) -> Path:
    return Path(root) / "runtime" / "broken.json"


def broken(root: Path) -> list[str]:
    return list(read_json(ledger(root), {}).get("builds") or [])


def refused(root: Path, version: str) -> bool:
    return any(name.startswith(f"journal-{version}-") for name in broken(root))


def heal(root: Path) -> str:
    root = Path(root)
    current = (root / "journal.pyz").resolve()
    bad = sorted({*broken(root), current.name})
    kept = [build for build in root.glob("journal-*.pyz") if build.name not in bad]
    if not kept:
        return ""
    previous = max(kept, key=lambda build: build.stat().st_mtime)
    write_json(ledger(root), {"builds": bad})
    point(root, previous)
    return f"journal: {current.name} would not start, so the journal went back to {previous.name}"
