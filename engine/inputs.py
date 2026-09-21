import time
import uuid
from pathlib import Path
from engine.stored import read_json, write_json

STALE = 600.0
FORCE = "force"
PERMIT = "permit"
KEYS = (FORCE, PERMIT)


def queue(root: Path, session: str, line: str, label: str, **data) -> dict:
    queued = {"session": session, "line": line, "label": label, "at": time.time(), **data}
    folder = Path(root) / "runtime" / "inputs"
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / f"{time.time_ns()}-{uuid.uuid4().hex}.json"
    write_json(target, queued)
    return queued


def take(root: Path, sessions: set[str], action: str = "") -> dict:
    folder = Path(root) / "runtime" / "inputs"
    for path in sorted(folder.glob("*.json")):
        queued = read_json(path)
        if not isinstance(queued, dict):
            path.unlink(missing_ok=True)
            continue
        if time.time() - float(queued.get("at") or 0) > STALE:
            path.unlink(missing_ok=True)
            continue
        if queued.get("session") not in sessions or pressed(queued.get("action")) != pressed(action):
            continue
        path.unlink(missing_ok=True)
        return queued
    return {}


def pressed(action) -> str:
    return action if action in KEYS else ""
