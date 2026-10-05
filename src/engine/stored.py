import json
from pathlib import Path

from engine.disk import Growth, JsonFiles, last_lines, read_json, replace
from engine.locks import writing
from engine.transaction import snapshot

__all__ = ["Growth", "JsonFiles", "append_text", "last_lines", "read_json", "write_json", "write_text", "write_unlocked"]


def write_text(path: Path, text: str) -> None:
    path = Path(path)
    with writing(path):
        write_unlocked(path, text)


def append_text(path: Path, text: str) -> None:
    path = Path(path)
    with writing(path), path.open("a") as appended:
        appended.write(text)


def write_unlocked(path: Path, text: str) -> None:
    snapshot(path)
    replace(path, text.encode())


def write_json(path: Path, data, indent: int | None = None) -> None:
    write_text(path, json.dumps(data, indent=indent))
