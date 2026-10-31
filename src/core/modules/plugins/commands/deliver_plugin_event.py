from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin_delivery import PluginDelivery


@dataclass(frozen=True)
class DeliverPluginEvent(Command[PluginDelivery]):
    """Records an event a plugin hears without holding it, for its program to run after the hook's reply."""

    plugin_id: int
    environment_id: int
    event: str
    data: str
