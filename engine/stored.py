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
