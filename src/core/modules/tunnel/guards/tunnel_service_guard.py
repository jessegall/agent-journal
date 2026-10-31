import json

from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.settings.models.setting import Setting
from core.modules.tunnel.support.tunnels import SERVICE_SETTING


class TunnelServiceGuard(Guard):
    """Refuses a tunnel service setting that names no tunnel an installed module declares."""

    name = "tunnel.known-service"
    event = "setting.*"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def check(self, change: Change[Model]) -> None:
        setting = change.row
        if not isinstance(setting, Setting) or setting.key != SERVICE_SETTING or change.event.endswith(".delete"):
            return
        name = json.loads(setting.value)
        if all(entry.name != name for entry in self.registry.tunnels):
            raise Refusal(f"no installed module declares the tunnel {name}", "journal setting tree lists the tunnel settings; a tunnel comes with its module")
