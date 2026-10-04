import time
from pathlib import Path

from engine import runtime

LOG = "diagnostics.log"


def logged(root: Path, text: str) -> None:
    try:
        with (runtime.folder(Path(root)) / LOG).open("a") as out:
            out.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {' '.join(text.split())}\n")
    except OSError:
        return
