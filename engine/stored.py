import json
import os
import threading
from pathlib import Path


def read_json(path: Path, default=None):
    try:
        return json.loads(Path(path).read_text())
    except (OSError, ValueError):
        return default


def write_text(path: Path, text: str) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    spare = path.with_name(f".{path.name}.{os.getpid()}.{threading.get_ident()}")
    spare.write_text(text)
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
