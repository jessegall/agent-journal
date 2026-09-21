import shutil
from pathlib import Path

from engine.record import RESOURCES
from resources.base import PROJECT
from resources.types import TYPES


def run(root: Path) -> str:
    root = Path(root)
    moved = []
    for kind in sorted(name for name, cls in TYPES.items() if cls.scope == PROJECT):
        old, new = root / kind, root / RESOURCES / kind
        if not old.is_dir():
            continue
        new.mkdir(parents=True, exist_ok=True)
        for entry in sorted(old.iterdir()):
            if not (new / entry.name).exists():
                shutil.move(str(entry), str(new / entry.name))
        if not any(old.iterdir()):
            old.rmdir()
        moved.append(kind)
    return f"project records moved into {RESOURCES}/: {', '.join(moved)}" if moved else "project records already in place"
