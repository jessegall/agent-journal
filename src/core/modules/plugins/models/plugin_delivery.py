from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginDelivery(EnvironmentScoped, Model):
    """An event a plugin hears but does not hold, waiting to be run after the hook's reply: the plugin, the
    environment, the agent whose hook it came from, the event's version 4 name and its data as JSON text."""

    model_name = "plugin_delivery"
    cli_name = "plugin-delivery"

    plugin_id: int
    environment_id: int = 0
    session_agent_id: int
    creator_id: int
    event: str
    data: str
