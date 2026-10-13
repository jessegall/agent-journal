import time
from pathlib import Path

from engine import runtime
from serving import JournalRoot

LOG = "diagnostics.log"


LOG_PATH = str(runtime.folder(Path()) / LOG)


def log_file(root: Path) -> Path:
    return Path(root) / LOG_PATH


def logged(root: JournalRoot, text: str) -> None:
    root.append(LOG_PATH, f"{time.strftime('%Y-%m-%d %H:%M:%S')} {' '.join(text.split())}")


def logged_at(folder: Path, text: str) -> None:
    """The same line, for whoever has no lane to be handed the journal's folder by."""
    from engine.record import Record
    from framework.lanes import TheJournalRoot
    logged(TheJournalRoot(Record(Path(folder), "main")), text)
