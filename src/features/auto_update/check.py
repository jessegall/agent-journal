import os
import signal
import subprocess
import threading
import time
from pathlib import Path

from controllers.types import Agents, Notices
from engine import runtime
from engine.actors import IDLE
from engine.heal import refused
from engine.sessions import Sessions
from engine.state import State
from engine.terminal import LAUNCH, relaunch
from engine.package import entry
from engine.version import version
from features import FEATURES
from features.trigger import spec
from resources.base import SYSTEM
from surfaces.updates import newer, stale, upstream

INSTALL_WAIT = 600
REFETCH_WAIT = 10


def journal_repository(project: Path) -> bool:
    return (project / "src" / "install.py").is_file() and (project / "src" / "features" / "auto_update").is_dir()


TRIED_AGAIN_AFTER = (1800, 7200, 21600)
FAILED_WORDS = ("not refreshed", "failed", "not built")


def ledger(root: Path) -> State:
    return State(runtime.folder(root) / "auto_update.json")


def claimed(root: Path, latest: str) -> bool:
    with ledger(root).changing() as tried:
        last = tried.get(latest) or {}
        wait = TRIED_AGAIN_AFTER[min(last.get("tries", 1), len(TRIED_AGAIN_AFTER)) - 1]
        if last.get("ok") or (last and time.time() - last.get("at", 0) < wait):
            return False
        tried[latest] = {"at": time.time(), "tries": last.get("tries", 0) + 1, "ok": False}
        return True


def first_refusal(root: Path, latest: str) -> bool:
    with ledger(root).changing() as tried:
        if tried.get(f"refused {latest}"):
            return False
        tried[f"refused {latest}"] = time.time()
        return True


def settled(root: Path, latest: str, failed: str) -> None:
    with ledger(root).changing() as tried:
        tried[latest] = {**(tried.get(latest) or {}), "ok": not failed, "why": failed}


def installed(root: Path) -> str:
    started = subprocess.Popen([*entry("journal"), "--root", str(root), "upgrade"], cwd=root.parent, stdout=subprocess.PIPE,
                               stderr=subprocess.STDOUT, text=True, start_new_session=True)
    try:
        out, _ = started.communicate(timeout=INSTALL_WAIT)
    except subprocess.TimeoutExpired:
        os.killpg(started.pid, signal.SIGKILL)
        started.communicate()
        (root / "runtime" / "upgrading").unlink(missing_ok=True)
        return f"journal upgrade was stopped after {INSTALL_WAIT // 60} minutes"
    lines = out.splitlines()
    if started.returncode:
        return next((line for line in reversed(lines) if line.strip()), f"journal upgrade failed with exit {started.returncode}")
    return next((line for line in lines if any(word in line for word in FAILED_WORDS)), "")


class UpdateCheck:
    def __init__(self, agent):
        self.agent = agent
        self.checked_at = 0.0
        self.installing = threading.Lock()

    def tick(self) -> str:
        record, feature = self.agent.record, FEATURES.get("auto_update")
        every = spec(record, feature.name, feature.trigger).every * 60 if feature else 0
        if not feature or time.time() - self.checked_at < every:
            return ""
        root = Path(record.root)
        self.checked_at = time.time() - (every - REFETCH_WAIT if stale(root) else 0)
        installed, latest = version(), upstream(root)
        if not feature.on(record) or not newer(latest, installed):
            return ""
        if refused(root, latest):
            if first_refusal(root, latest):
                self.tell(feature, "failed", latest=latest, why="it would not start here, so the journal went back to the build that works; it is tried again in 12 hours")
            return ""
        if not claimed(root, latest):
            return ""
        if feature.on(record, "install") and not journal_repository(root.parent):
            threading.Thread(target=self.install, args=(feature, latest), daemon=True).start()
            return f"installing {latest}"
        self.tell(feature, "newer", latest=latest, installed=installed)
        return f"told of {latest}"

    def install(self, feature, latest: str) -> None:
        if not self.installing.acquire(blocking=False):
            return
        root = Path(self.agent.record.root)
        try:
            failed = installed(root)
        finally:
            self.installing.release()
        settled(root, latest, failed)
        if failed:
            self.tell(feature, "failed", latest=latest, why=failed)
            Notices(self.agent.record, actor=SYSTEM).create(f"The journal could not update to {latest}", brief=failed, tone="warn")

    def tell(self, feature, line: str, **values) -> None:
        title, brief = feature.line(line, values)
        self.agent.driver.send(f"{title} - {brief}")


class Relaunch:
    def __init__(self, agent):
        self.agent = agent

    def tick(self) -> str:
        driver, record = self.agent.driver, self.agent.record
        root = Path(record.root)
        if Sessions(root).read(driver.session).launch >= LAUNCH or self.agent.state() != IDLE:
            return ""
        last = driver.last_report()
        if not last or not last.title:
            return ""
        Agents(record, actor=SYSTEM).card(last.n, label=f"Restarted the agent in the same conversation to pick up journal {version()}", icon="agents", tone="good")
        relaunch(root, record.env, driver.session, last.title)
        return "relaunching"
