import importlib
import json
import os
import re
import shutil
import time
from pathlib import Path
from engine.package import modules
from engine.locks import hold_record_writes
from engine.stored import write_text
from resources.fields import Loaded
from dataclasses import dataclass
from engine.ledger import applied, ledger



def names() -> list[str]:
    return [name for name, _ in modules("migrations") if re.fullmatch(r"m\d{4}_\w+", name)]


def shipped(root: Path, ship, kind: str) -> str:
    from engine import runtime
    from engine.record import Record
    made = ship(Record(Path(root), runtime.env(Path(root))))
    return f"{kind} shipped: {', '.join(made)}" if made else f"the shipped {kind} are already there"


@dataclass(frozen=True)
class MigrationRun(Loaded):
    at: float = 0.0
    result: str = ""


def ran(root: Path) -> dict[str, MigrationRun]:
    return {name: MigrationRun.from_json(entry) for name, entry in applied(root).items() if isinstance(entry, dict)}


RECORD = ("environments", "project", "plugin-data", "migrations.json", "record.json", "settings.json")
BACKUP = "before-migrations"


def backed_up(root: Path) -> Path:
    backup = root / f".{BACKUP}-{os.getpid()}-{time.time_ns()}"
    backup.mkdir(parents=True)
    for name in RECORD:
        source = root / name
        if source.is_dir():
            shutil.copytree(source, backup / name, symlinks=True)
        elif source.is_file():
            shutil.copy2(source, backup / name)
    return backup


def restored(root: Path, backup: Path) -> None:
    for name in RECORD:
        current, kept = root / name, backup / name
        if current.is_dir():
            shutil.rmtree(current, ignore_errors=True)
        elif current.exists():
            current.unlink()
        if kept.is_dir():
            shutil.copytree(kept, current, symlinks=True, dirs_exist_ok=True)
        elif kept.is_file():
            shutil.copy2(kept, current)


def run(root: Path) -> list[str]:
    import features
    features.load()
    root = Path(root)
    if not pending(applied(root)):
        return []
    with hold_record_writes(root):
        return run_locked(root)


def pending(done: dict) -> list[str]:
    return [name for name in names() if name not in done]


def run_locked(root: Path) -> list[str]:
    done = applied(root)
    if not pending(done):
        return []
    backup = backed_up(root) if root.is_dir() and any((root / name).exists() for name in RECORD) else None
    ran = []
    steps = {name: importlib.import_module(f"migrations.{name}").run for name in pending(done)}
    last = {step: name for name, step in steps.items()}
    try:
        for name, step in steps.items():
            result = step(root) if last[step] == name else "runs once, at its last place in this batch"
            done[name] = {"at": time.time(), "result": result}
            root.mkdir(parents=True, exist_ok=True)
            write_text(ledger(root), json.dumps(done, indent=2))
            ran.append(name)
    except Exception:
        if backup:
            restored(root, backup)
            shutil.rmtree(backup, ignore_errors=True)
        raise
    if backup:
        shutil.rmtree(backup, ignore_errors=True)
    return ran
