from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginOutput(Model):
    """A plugin answer waiting to be applied; system event answers have no environment."""

    model_name = "plugin_output"
    event_forms = ()
    cli_name = "plugin-output"

    plugin_id: int
    environment_id: int | None = None
    session_agent_id: int | None = None
    creator_id: int
    output: str
    is_environment_visible: bool = False
