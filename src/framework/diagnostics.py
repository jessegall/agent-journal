"""The journal's own diagnostics log: where it is kept and how a line is written to it."""

import time
from pathlib import Path

from resources.places import folder

LOG = "diagnostics.log"
LOG_PATH = str(folder(Path()) / LOG)


def log_file(root: Path) -> Path:
    return Path(root) / LOG_PATH


def logged(root, text: str) -> None:
    root.append(LOG_PATH, f"{time.strftime('%Y-%m-%d %H:%M:%S')} {' '.join(text.split())}")
