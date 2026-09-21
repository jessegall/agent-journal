import shutil
from pathlib import Path

from engine.record import RESOURCES
from resources.base import PROJECT
from resources.types import TYPES


def gather(old: Path, new: Path) -> None:
    new.mkdir(parents=True, exist_ok=True)
    for entry in sorted(old.iterdir()):
        if not (new / entry.name).exists():
            shutil.move(str(entry), str(new / entry.name))
    if not any(old.iterdir()):
        old.rmdir()


def run(root: Path) -> str:
    root = Path(root)
    moved = []
    for kind in sorted(name for name, cls in TYPES.items() if cls.scope == PROJECT):
        for old in (root / kind, root / "resources" / kind):
            if old.is_dir():
                gather(old, root / RESOURCES / kind)
                moved.append(kind)
    return f"project records moved into {RESOURCES}/: {', '.join(sorted(set(moved)))}" if moved else "project records already in place"
