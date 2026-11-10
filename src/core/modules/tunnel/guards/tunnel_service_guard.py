import json

from engine.change.created import Created
from engine.change.updated import Updated
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.settings.models.setting import Setting
from core.modules.tunnel.support.tunnels import SERVICE_SETTING


class TunnelServiceGuard(Guard[Created[Setting] | Updated[Setting]]):
    """Refuses a tunnel service setting that names no tunnel an installed module declares."""

    name = "tunnel.known-service"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def check(self, event: Created[Setting] | Updated[Setting], context: Context) -> None:
        setting = event.row
        if setting.key != SERVICE_SETTING:
            return
        name = json.loads(setting.value)
        if all(entry.name != name for entry in self.registry.tunnels):
            raise Refusal(f"no installed module declares the tunnel {name}", "journal setting tree lists the tunnel settings; a tunnel comes with its module")
