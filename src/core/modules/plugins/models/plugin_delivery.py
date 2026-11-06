from dataclasses import dataclass
from typing import ClassVar

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginDelivery(Model):
    """An event a plugin hears without holding it, waiting to be run after the change: the plugin, the environment and
    the agent it came from, if any, the event's name, its data as JSON text, the script it runs, if any, and the log
    row it came from. A system event has no environment, so this is no EnvironmentScoped model."""

    model_name = "plugin_delivery"
    event_forms = ()
    cli_name = "plugin-delivery"

    hidden_fields: ClassVar[frozenset[str]] = frozenset({"data"})

    plugin_id: int
    environment_id: int | None = None
    session_agent_id: int | None = None
    creator_id: int
    event: str
    data: str
    script: str = ""
    event_id: int | None = None
