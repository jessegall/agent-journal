from core.base.container import Container
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.tunnel.tunnel import Tunnel
from core.modules.settings.bindings.support.setting_values import SettingValues

SERVICE_SETTING = "journal.core.tunnel.service"


class Tunnels:
    """The tunnels the installed modules declare, and the one the tunnel module's service setting chooses."""

    def __init__(self, registry: Registry, container: Container, settings: SettingValues) -> None:
        self.registry, self.container, self.settings = registry, container, settings

    def chosen(self) -> Tunnel:
        return self.tunnel(self.settings.text(SERVICE_SETTING, None))

    def tunnel(self, name: str) -> Tunnel:
        entry = next((entry for entry in self.registry.tunnels if entry.name == name), None)
        if entry is None:
            raise Refusal(f"no installed module declares the tunnel {name}", "journal setting show journal.core.tunnel.service shows the tunnel in use")
        return self.container.get(entry.path.checked_class(Tunnel))

    def all(self) -> list[Tunnel]:
        return [self.tunnel(entry.name) for entry in sorted(self.registry.tunnels, key=lambda entry: entry.name)]
