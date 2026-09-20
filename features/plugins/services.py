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


def watch(root: Path, enabled) -> None:
    threading.Thread(target=keep, args=(Path(root), enabled), daemon=True).start()


def keep(root: Path, enabled) -> None:
    while True:
        told(root, enabled)
        time.sleep(WATCH)


def here(root: Path) -> Record:
    return Record(Path(root), default_env(Path(root)))


def told(root: Path, enabled) -> list[str]:
    record = here(root)
    if not enabled(record):
        return []
    notices = Notices(record, actor=SYSTEM)
    open_ = {n.data.get(TOLD): n for n in notices.all() if not n.completed and n.data.get(TOLD)}
    said = []
    for sid, state in states(root).items():
        failing = state.get("state") in (FAILED, BLOCKED)
        if failing and sid not in open_:
            notices.create(f"Service {sid} is not running", brief=f"{state.get('why') or 'it stopped'}\nIts log is {log_file(root, sid)}.",
                           tone="warn", **{TOLD: sid})
            said.append(sid)
        if not failing and sid in open_:
            notices.complete(open_[sid].n, "it is running again")
    return said
