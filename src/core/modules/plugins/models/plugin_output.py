from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginOutput(EnvironmentScoped, Model):
    """A plugin's answer that shows cards or runs journal commands, waiting to be applied after the hook's
    reply as the plugins module: the plugin, the environment, the agent and the answer's JSON line."""

    model_name = "plugin_output"
    event_forms = ()
    cli_name = "plugin-output"

    plugin_id: int
    environment_id: int = 0
    session_agent_id: int
    creator_id: int
    output: str
