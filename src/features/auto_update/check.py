import subprocess
import threading
import time
from pathlib import Path

from controllers.types import Agents
from engine.actors import IDLE
from engine.heal import refused
from engine.sessions import Sessions
from engine.terminal import LAUNCH, relaunch
from engine.package import entry
from engine.version import version
from features import FEATURES
from features.dev_faults.developing import developing
from features.trigger import spec
from resources.base import SYSTEM
from surfaces.updates import newer, stale, upstream

INSTALL_WAIT = 600
REFETCH_WAIT = 10


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
        if not feature.on(record) or not newer(latest, installed) or refused(root, latest):
            return ""
        if not record.state("auto_update").claim(f"tried.{latest}", time.time()):
            return ""
        if feature.on(record, "install") and not developing(root.parent):
            threading.Thread(target=self.install, args=(feature, latest), daemon=True).start()
            return f"installing {latest}"
        self.tell(feature, "newer", latest=latest, installed=installed)
        return f"told of {latest}"

    def install(self, feature, latest: str) -> None:
        if not self.installing.acquire(blocking=False):
            return
        root = Path(self.agent.record.root)
        try:
            ran = subprocess.run([*entry("journal"), "--root", str(root), "upgrade"], cwd=root.parent, capture_output=True, text=True, timeout=INSTALL_WAIT)
            lines = (ran.stdout + ran.stderr).splitlines() + ([] if ran.returncode == 0 else [f"journal upgrade failed with exit {ran.returncode}"])
        except Exception as error:
            lines = [f"package not refreshed: {error}"]
        finally:
            self.installing.release()
        failed = next((line for line in lines if "not refreshed" in line or "failed" in line), "")
        if failed:
            self.tell(feature, "failed", latest=latest, why=failed)

    def tell(self, feature, line: str, **values) -> None:
        title, brief = feature.line(line, values)
        self.agent.driver.send(f"{title} - {brief}")


class Relaunch:
    def __init__(self, agent):
        self.agent = agent

    def tick(self) -> str:
        driver, record = self.agent.driver, self.agent.record
        root = Path(record.root)
        if int(Sessions(root).read(driver.session).get("launch") or 0) >= LAUNCH or self.agent.state() != IDLE:
            return ""
        last = driver.last_report()
        if not last or not last.title:
            return ""
        Agents(record, actor=SYSTEM).card(last.n, label=f"Restarted the agent in the same conversation to pick up journal {version()}", icon="agents", tone="good")
        relaunch(root, record.env, driver.session, last.title)
        return "relaunching"
