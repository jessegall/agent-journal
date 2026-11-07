from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin_delivery import PluginDelivery


@dataclass(frozen=True)
class DeliverPluginEvent(Command[PluginDelivery]):
    """Records an event a plugin hears without holding it, for its program to run after the hook's reply."""

    lock = False

    plugin_id: int
    agent_id: int | None
    event: str
    data: str
    script: str = ""
    event_id: int | None = None
    environment_id: int | None = None
