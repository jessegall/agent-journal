from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plugins.models.plugin_output import PluginOutput


@dataclass(frozen=True)
class AddPluginOutput(Command[PluginOutput]):
    """Keeps a plugin's answer that shows cards or runs commands, for its listener to apply after the reply.
    """

    lock = False

    plugin_id: int
    agent_id: int | None
    output: str
    is_environment_visible: bool = False
