import time
from pathlib import Path

from resources.places import folder
from serving import JournalRoot

LOG = "diagnostics.log"


LOG_PATH = str(folder(Path()) / LOG)


def log_file(root: Path) -> Path:
    return Path(root) / LOG_PATH


def logged(root: JournalRoot, text: str) -> None:
    root.append(LOG_PATH, f"{time.strftime('%Y-%m-%d %H:%M:%S')} {' '.join(text.split())}")
