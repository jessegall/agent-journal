import threading
import time
from pathlib import Path

from controllers.types import Notices
from engine.record import Record
from engine.services import BLOCKED, FAILED, log_file, states
from features.base import Feature
from resources.base import SYSTEM

WATCH = 5.0
TOLD = "service"


class Services(Feature):
    name = "services"
    title_ = "Plugin services"
    abstract_ = "The servers a plugin declares are kept up while a session runs, and die with it"
    help_ = "A plugin's manifest declares its services; the session that starts them owns them, and journal services lists, starts, stops and restarts them. A service that gives up is said once, over the chat."
    fixed = True

    def watch(self, root: Path) -> None:
        threading.Thread(target=self.keep, args=(Path(root),), daemon=True).start()

    def keep(self, root: Path) -> None:
        while True:
            self.told(root)
            time.sleep(WATCH)

    def record(self, root: Path) -> Record:
        home = Path(root) / "runtime" / "env"
        return Record(Path(root), home.read_text().strip() if home.is_file() else "main")

    def told(self, root: Path) -> list[str]:
        record = self.record(root)
        if not self.enabled(record):
            return []
        notices = Notices(record, actor=SYSTEM)
        open_ = {n.data.get(TOLD): n for n in notices.all() if not n.completed and n.data.get(TOLD)}
        said = []
        for sid, state in states(root).items():
            failing = state.get("state") in (FAILED, BLOCKED)
            if failing and sid not in open_:
                notices.create(f"Service {sid} is not running", brief=f"{state.get('why') or 'it stopped'}\nIts log is {log_file(root, sid)}.", tone="warn", **{TOLD: sid})
                said.append(sid)
            if not failing and sid in open_:
                notices.complete(open_[sid].n, "it is running again")
        return said
