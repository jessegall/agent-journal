from dataclasses import dataclass
from typing import ClassVar

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginDelivery(Model):
    """A queued plugin event; system events have no environment."""

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
