import importlib
import json
import os
import re
import shutil
import time
from pathlib import Path
from engine.package import modules
from engine.stored import read_json, write_text
from engine.fields import number_of, text_of
from dataclasses import dataclass



def names() -> list[str]:
    return [name for name, _ in modules("migrations") if re.fullmatch(r"m\d{4}_\w+", name)]


def shipped(root: Path, ship, kind: str) -> str:
    from engine import runtime
    from engine.record import Record
    made = ship(Record(Path(root), runtime.env(Path(root))))
    return f"{kind} shipped: {', '.join(made)}" if made else f"the shipped {kind} are already there"


def ledger(root: Path) -> Path:
    return Path(root) / "migrations.json"


def applied(root: Path) -> dict:
    return read_json(ledger(root), {})


@dataclass(frozen=True)
class MigrationRun:
    at: float
    result: str


def ran(root: Path) -> dict[str, MigrationRun]:
    return {name: MigrationRun(number_of(entry, "at"), text_of(entry, "result")) for name, entry in applied(root).items() if isinstance(entry, dict)}


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
            shutil.rmtree(current)
        elif current.exists():
            current.unlink()
        if kept.is_dir():
            shutil.copytree(kept, current, symlinks=True)
        elif kept.is_file():
            shutil.copy2(kept, current)


def run(root: Path) -> list[str]:
    import features
    features.load()
    root = Path(root)
    done = applied(root)
    pending = [name for name in names() if name not in done]
    if not pending:
        return []
    backup = backed_up(root) if root.is_dir() and any((root / name).exists() for name in RECORD) else None
    ran = []
    try:
        for name in pending:
            module = importlib.import_module(f"migrations.{name}")
            result = module.run(root)
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
