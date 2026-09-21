import threading
import time
from pathlib import Path

from controllers.types import Notices
from engine.hooks import default_env
from engine.record import Record
from engine.services import BLOCKED, FAILED, log_file, states
from resources.base import SYSTEM

WATCH = 5.0
TOLD = "service"


def watch(root: Path, enabled, journal) -> None:
    threading.Thread(target=keep, args=(Path(root), enabled, journal), daemon=True).start()


def keep(root: Path, enabled, journal) -> None:
    while True:
        told(root, enabled, journal)
        time.sleep(WATCH)


def here(root: Path) -> Record:
    return Record(Path(root), default_env(Path(root)))


def told(root: Path, enabled, journal) -> list[str]:
    record = here(root)
    if not enabled(record):
        return []
    open_ = {n.data.get(TOLD): n for n in Notices(record, actor=SYSTEM)._standing() if n.data.get(TOLD)}
    said = []
    for sid, state in states(root).items():
        failing = state.get("state") in (FAILED, BLOCKED)
        if failing and sid not in open_:
            journal.notice(record, "stopped", name=sid, why=state.get("why") or "it stopped", log=log_file(root, sid), tone="warn", **{TOLD: sid})
            said.append(sid)
        if not failing and sid in open_:
            journal.clear(record, open_[sid], "it is running again")
    return said
