import threading
from pathlib import Path

from engine.stored import read_json, write_json
from engine.version import version
from features import trigger
from features.base import Behaviour, Feature, Line, event
from features.faults.feature import developing
from surfaces.updates import newer, upstream

INSTALLING = threading.Lock()


class Updates(Feature):
    name = "updates"
    title_ = "Updates"
    abstract_ = "A newer journal is installed by itself, or the agent is told to install it"
    help_ = ("Every half hour of an agent's time the feature compares the version published on GitHub with the one installed. "
             "With install on, a newer version is installed in the background, once per version, and the server reloads itself; "
             "with it off, or when installing fails, the agent is told to run journal upgrade. A journal being developed never installs itself.")
    trigger = {"every": 30, "unit": trigger.MINUTES}
    behaviours = {"install": Behaviour("Install a newer version by itself", "Off, the agent is told to run journal upgrade instead")}
    lines = {"newer": Line("journal {{latest}} is out, this project runs {{installed}}", "run journal upgrade to install it"),
             "failed": Line("installing journal {{latest}} failed", "{{why}} - run journal upgrade to try again")}

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent or not self.due(record, agent):
            return
        installed, latest = version(), upstream(record.root)
        if not newer(latest, installed):
            return
        tried = record.root / "runtime" / "updates.json"
        if read_json(tried, {}).get("tried") == latest:
            return
        write_json(tried, {"tried": latest})
        if self.on(record, "install") and not developing(Path(record.root).parent):
            threading.Thread(target=self.install, args=(record, agent, latest), daemon=True).start()
        else:
            self.say(record, agent, "newer", latest=latest, installed=installed)

    def install(self, record, agent, latest: str) -> None:
        from install import upgrade
        if not INSTALLING.acquire(blocking=False):
            return
        try:
            said = upgrade(Path(record.root).parent, Path(record.root))
        except Exception as error:
            said = [f"package not refreshed: {error}"]
        finally:
            INSTALLING.release()
        failed = next((line for line in said if "not refreshed" in line or "failed" in line), "")
        if failed:
            self.say(record, agent, "failed", latest=latest, why=failed)
