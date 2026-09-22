import subprocess
import threading
import time
from pathlib import Path

from engine.heal import refused
from engine.package import entry
from engine.stored import read_json, write_json
from engine.version import version
from features import FEATURES
from features.dev_faults.developing import developing
from features.trigger import spec
from surfaces.updates import newer, upstream

INSTALL_WAIT = 600


class UpdateCheck:
    def __init__(self, agent):
        self.agent = agent
        self.checked_at = 0.0
        self.installing = threading.Lock()

    def tick(self) -> str:
        record, feature = self.agent.record, FEATURES.get("auto_update")
        if not feature or time.time() - self.checked_at < spec(record, feature.name, feature.trigger).every * 60:
            return ""
        self.checked_at = time.time()
        root = Path(record.root)
        installed, latest = version(), upstream(root)
        if not feature.on(record) or not newer(latest, installed) or refused(root, latest):
            return ""
        tried = root / "runtime" / "updates.json"
        if read_json(tried, {}).get("tried") == latest:
            return ""
        write_json(tried, {"tried": latest})
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
        except (OSError, subprocess.SubprocessError) as error:
            lines = [f"package not refreshed: {error}"]
        finally:
            self.installing.release()
        failed = next((line for line in lines if "not refreshed" in line or "failed" in line), "")
        if failed:
            self.tell(feature, "failed", latest=latest, why=failed)

    def tell(self, feature, line: str, **values) -> None:
        title, brief = feature.line(line, values)
        self.agent.driver.send(f"{title} - {brief}")
