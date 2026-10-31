from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin_output import PluginOutput


@dataclass(frozen=True)
class AddPluginOutput(Command[PluginOutput]):
    """Keeps a plugin's answer that shows cards or runs commands, for its listener to apply after the reply."""

    plugin_id: int
    environment_id: int
    output: str
