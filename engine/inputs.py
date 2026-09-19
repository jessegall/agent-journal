import json
import time
import uuid
from pathlib import Path

STALE = 600.0
FORCE = "force"


def queue(root: Path, session: str, line: str, label: str, **data) -> dict:
    queued = {"session": session, "line": line, "label": label, "at": time.time(), **data}
    folder = Path(root) / "runtime" / "inputs"
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / f"{time.time_ns()}-{uuid.uuid4().hex}.json"
    temporary = target.with_suffix(".tmp")
    temporary.write_text(json.dumps(queued))
    temporary.replace(target)
    return queued


def take(root: Path, sessions: set[str], action: str = "") -> dict:
    folder = Path(root) / "runtime" / "inputs"
    for path in sorted(folder.glob("*.json")):
        try:
            queued = json.loads(path.read_text())
        except (OSError, ValueError):
            path.unlink(missing_ok=True)
            continue
        if time.time() - float(queued.get("at") or 0) > STALE:
            path.unlink(missing_ok=True)
            continue
        if queued.get("session") not in sessions or (queued.get("action") == FORCE) != (action == FORCE):
            continue
        path.unlink(missing_ok=True)
        return queued
    return {}
