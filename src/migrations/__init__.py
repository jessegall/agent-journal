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


SLACK = 2.0


def synced(root: Path, backup: Path, since: float) -> None:
    """Brings a backup made while the record was still being written up to the record as it is now: copies what changed since it began and drops what is gone, so only the changes are copied while writes are held."""
    for name in RECORD:
        source, kept = root / name, backup / name
        if source.is_dir():
            kept.mkdir(exist_ok=True)
            synced_folder(source, kept, since - SLACK)
        elif source.is_file() and (not kept.exists() or source.stat().st_mtime >= since - SLACK):
            shutil.copy2(source, kept)
        elif not source.exists() and kept.exists():
            dropped(kept)


def dropped(path: Path) -> None:
    if path.is_dir() and not path.is_symlink():
        shutil.rmtree(path)
        return
    path.unlink()


def synced_folder(source: Path, kept: Path, since: float) -> None:
    here = {entry.name: entry for entry in os.scandir(source)}
    for entry in os.scandir(kept):
        if entry.name not in here:
            dropped(Path(entry.path))
    for name, entry in here.items():
        target = kept / name
        if entry.is_symlink() or entry.is_file(follow_symlinks=False):
            if not target.is_symlink() and target.is_file() and entry.is_file() and entry.stat().st_mtime < since:
                continue
            if target.is_dir() and not target.is_symlink():
                shutil.rmtree(target)
            elif target.exists() or target.is_symlink():
                target.unlink()
            shutil.copy2(entry.path, target, follow_symlinks=False)
            continue
        if target.exists() and not target.is_dir():
            target.unlink()
        target.mkdir(exist_ok=True)
        synced_folder(Path(entry.path), target, since)


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


def run(root: Path, waiting: bool = True) -> list[str]:
    """Migrates the record. An upgrade waits for the write lock; a server starting up while one runs does not, and serves the record as it is."""
    import features
    features.load()
    root = Path(root)
    if not pending(applied(root)):
        return []
    began = time.time()
    prepared = (backed_up(root), began) if waiting and has_record(root) else None
    spare = prepared[0] if prepared else None
    ran, backup = [], None
    try:
        with hold_record_writes(root, waiting) as held:
            if held:
                ran, backup = run_locked(root, prepared)
    finally:
        for kept in {spare, backup} - {None}:
            shutil.rmtree(kept, ignore_errors=True)
    return ran


def has_record(root: Path) -> bool:
    return root.is_dir() and any((root / name).exists() for name in RECORD)


def pending(done: dict) -> list[str]:
    return [name for name in names() if name not in done]


def run_locked(root: Path, prepared: tuple | None = None) -> tuple[list[str], Path | None]:
    """The migrations still to run, with the backup that stands guard while they do; the caller deletes the backup once the lock is let go."""
    done = applied(root)
    if not pending(done):
        return [], None
    if prepared:
        backup = prepared[0]
        synced(root, backup, prepared[1])
    else:
        backup = backed_up(root) if has_record(root) else None
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
        raise
    return ran, backup
