import os
import signal
import subprocess
import threading
import time
from pathlib import Path

from controllers.types import Notices
from engine import runtime
from engine.heal import refused
from engine.state import State
from engine.package import entry
from engine.version import version
from features import running
from features.auto_update.countdown import cancel, wait
from features.auto_update.feature import AutoUpdate
from resources.base import SYSTEM
from engine.upgrades import newer, shared_parts, stale, upstream
from features.journal_laws.managed import changed_managed

INSTALL_WAIT = 600
REFETCH_WAIT = 10


KEPT_PARTS = {"patches": 2, "minor versions": 1, "major versions": 0, "always": 0}


def within(installed: str, latest: str, installs: str) -> bool:
    return shared_parts(latest, installed, KEPT_PARTS[installs])


def journal_repository(project: Path) -> bool:
    return (project / "src" / "install.py").is_file() and (project / "src" / "features" / "auto_update").is_dir()


TRIED_AGAIN_AFTER = (1800, 7200, 21600)
FAILED_WORDS = ("not refreshed", "failed", "not built")


def failure_in(lines) -> str:
    return next((line for line in lines if any(word in line for word in FAILED_WORDS)), "")


def ledger(root: Path) -> State:
    return State(runtime.folder(root) / "auto_update.json")


def claimed(root: Path, latest: str, installs: str) -> bool:
    with ledger(root).changing() as tried:
        last = tried.get(latest) or {}
        wait = TRIED_AGAIN_AFTER[0 if installs == "always" else min(last.get("tries", 1), len(TRIED_AGAIN_AFTER)) - 1]
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


def installed(root: Path, yes: bool, version: str) -> str:
    command = [*entry("journal"), "--root", str(root), "upgrade"]
    if yes:
        command.append("--yes")
    if version:
        command += ["--to", version]
    started = subprocess.Popen(command, cwd=root.parent, stdout=subprocess.PIPE,
                               stderr=subprocess.STDOUT, text=True, start_new_session=True)
    try:
        out, _ = started.communicate(timeout=INSTALL_WAIT)
    except subprocess.TimeoutExpired:
        os.killpg(started.pid, signal.SIGKILL)
        started.communicate()
        runtime.upgrade_mark(root).unlink(missing_ok=True)
        return f"journal upgrade was stopped after {INSTALL_WAIT // 60} minutes"
    lines = out.splitlines()
    if started.returncode:
        return next((line for line in reversed(lines) if line.strip()), f"journal upgrade failed with exit {started.returncode}")
    return failure_in(lines)


class UpdateCheck:
    def __init__(self, agent):
        self.agent = agent
        self.checked_at = 0.0
        self.installing = threading.Lock()

    def tick(self) -> str:
        record, feature = self.agent.record, running(AutoUpdate)
        every = feature.interval(record) if feature else 0
        if not feature or time.time() - self.checked_at < every:
            return ""
        root = Path(record.root)
        self.checked_at = time.time() - (every - REFETCH_WAIT if stale(root) else 0)
        installed, latest = version(), upstream(root)
        if not newer(latest, installed):
            return ""
        if refused(root, latest):
            if first_refusal(root, latest):
                self.tell(feature, "failed", latest=latest, why="it would not start here, so the journal went back to the build that works; it is tried again in 12 hours")
            return ""
        if changed_managed(root.parent, root):
            return "update held for changed files"
        if not claimed(root, latest, feature.values(record).installs):
            return ""
        if feature.on(record) and within(installed, latest, feature.values(record).installs) and not journal_repository(root.parent):
            threading.Thread(target=self.install, args=(feature, latest), daemon=True).start()
            return f"installing {latest}"
        self.tell(feature, "newer", latest=latest, installed=installed)
        return f"told of {latest}"

    def install(self, feature, latest: str) -> None:
        if not self.installing.acquire(blocking=False):
            return
        root = Path(self.agent.record.root)
        try:
            if not wait(root, latest):
                return
            failed = installed(root, False, "")
        finally:
            cancel(root)
            self.installing.release()
        settled(root, latest, failed)
        if failed:
            self.tell(feature, "failed", latest=latest, why=failed)
            Notices(self.agent.record, actor=SYSTEM).create(f"The journal could not update to {latest}", brief=failed, tone="warn")

    def tell(self, feature, line: str, **values) -> None:
        self.agent.driver.send(feature.line_text(line, **values))
