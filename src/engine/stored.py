import json
import os
import threading
from contextlib import contextmanager
from pathlib import Path

UNDO = threading.local()


def read_json(path: Path, default=None):
    try:
        return json.loads(Path(path).read_text())
    except (OSError, ValueError):
        return default


@contextmanager
def undoable():
    if getattr(UNDO, "saved", None) is not None:
        yield UNDO
        return
    UNDO.saved, UNDO.events = {}, []
    try:
        yield UNDO
    except BaseException:
        for path, before in UNDO.saved.items():
            if before is None:
                Path(path).unlink(missing_ok=True)
            else:
                replace(Path(path), before)
        UNDO.saved, UNDO.events = None, None
        raise
    events, UNDO.saved, UNDO.events = UNDO.events, None, None
    for release in events:
        release()


def held_back(release) -> bool:
    events = getattr(UNDO, "events", None)
    if events is None:
        return False
    events.append(release)
    return True


def write_text(path: Path, text: str) -> None:
    path = Path(path)
    saved = getattr(UNDO, "saved", None)
    if saved is not None and str(path) not in saved:
        saved[str(path)] = path.read_bytes() if path.is_file() else None
    replace(path, text.encode())


def replace(path: Path, raw: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    spare = path.with_name(f".{path.name}.{os.getpid()}.{threading.get_ident()}")
    spare.write_bytes(raw)
    os.replace(spare, path)


def write_json(path: Path, data, indent: int | None = None) -> None:
    write_text(path, json.dumps(data, indent=indent))


def tail(path, size: int) -> list[str]:
    try:
        with Path(path).open("rb") as source:
            source.seek(0, 2)
            end = source.tell()
            start = max(0, end - size)
            source.seek(start)
            raw = source.read()
    except (OSError, TypeError):
        return []
    if start:
        raw = raw.split(b"\n", 1)[-1]
    return raw.decode(errors="replace").splitlines()


LOG_BYTES = 262144


def last_lines(path, lines: int) -> str:
    return "\n".join(tail(path, LOG_BYTES)[-lines:])
