from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginOutput(Model):
    """A plugin's answer that shows cards or runs journal commands, waiting to be applied after the hook's
    reply as the plugins module: the plugin, the environment and the agent, if any, and the answer's JSON line. A
    system event has no environment, so this is no EnvironmentScoped model."""

    model_name = "plugin_output"
    event_forms = ()
    cli_name = "plugin-output"

    plugin_id: int
    environment_id: int | None = None
    session_agent_id: int | None = None
    creator_id: int
    output: str
