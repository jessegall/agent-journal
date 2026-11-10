from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plugins.models.enums.service_change import ServiceChange


@dataclass(frozen=True)
class ChangePluginService(Command[str]):
    """Stops, starts or restarts one service of a plugin."""

    change: ServiceChange
    plugin: str
    service: str

    @property
    def key(self) -> tuple[str, str]:
        return self.plugin, self.service
