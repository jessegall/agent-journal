import time
from pathlib import Path

from engine import runtime

LOG = "diagnostics.log"


def log_file(root: Path) -> Path:
    return runtime.folder(Path(root)) / LOG


def logged(root: Path, text: str) -> None:
    try:
        with log_file(root).open("a") as out:
            out.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {' '.join(text.split())}\n")
    except OSError:
        return
