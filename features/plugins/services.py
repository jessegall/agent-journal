import threading
import time
from pathlib import Path

from controllers.types import Notices
from engine.hooks import default_env
from engine.record import Record
from engine.services import BLOCKED, FAILED, log_file, states

WATCH = 5.0
TOLD = "service"


def watch(root: Path, feature) -> None:
    threading.Thread(target=keep, args=(Path(root), feature), daemon=True).start()


def keep(root: Path, feature) -> None:
    while True:
        notice_stopped(root, feature)
        time.sleep(WATCH)


def here(root: Path) -> Record:
    return Record(Path(root), default_env(Path(root)))


def notice_stopped(root: Path, feature) -> list[str]:
    record = here(root)
    if not feature.enabled(record):
        return []
    open_ = {n.data.get(TOLD): n for n in feature.standing(record, Notices) if n.data.get(TOLD)}
    stopped = []
    for sid, state in states(root).items():
        failing = state.get("state") in (FAILED, BLOCKED)
        if failing and sid not in open_:
            feature.journal.notice(record, "stopped", name=sid, why=state.get("why") or "it stopped", log=log_file(root, sid), tone="warn", **{TOLD: sid})
            stopped.append(sid)
        if not failing and sid in open_:
            feature.journal.clear(record, open_[sid], "it is running again")
    return stopped
