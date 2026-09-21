import threading
from pathlib import Path

from engine.events import AgentUpdated
from engine.stored import read_json, write_json
from engine.version import version
from features.faults.developing import developing
from features.parts import WHOLE_FEATURE, Context, Handler
from surfaces.updates import newer, upstream

INSTALLING = threading.Lock()


class InstallNewerVersion(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: Context, event: AgentUpdated) -> None:
        installed, latest = version(), upstream(context.record.root)
        if not newer(latest, installed):
            return
        tried = context.record.root / "runtime" / "updates.json"
        if read_json(tried, {}).get("tried") == latest:
            return
        write_json(tried, {"tried": latest})
        if context.on("install") and not developing(Path(context.record.root).parent):
            threading.Thread(target=self.install, args=(context, latest), daemon=True).start()
        else:
            context.agent.say("newer", latest=latest, installed=installed)

    def install(self, context: Context, latest: str) -> None:
        from install import upgrade
        if not INSTALLING.acquire(blocking=False):
            return
        try:
            said = upgrade(Path(context.record.root).parent, Path(context.record.root))
        except Exception as error:
            said = [f"package not refreshed: {error}"]
        finally:
            INSTALLING.release()
        failed = next((line for line in said if "not refreshed" in line or "failed" in line), "")
        if failed:
            context.agent.say("failed", latest=latest, why=failed)
