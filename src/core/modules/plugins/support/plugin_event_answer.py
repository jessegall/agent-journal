from dataclasses import dataclass

from core.modules.plugins.support.plugin_answer import PluginAnswer


@dataclass(frozen=True)
class PluginEventAnswer:
    """What one plugin's script answered for a change, with the plugin it came from."""

    plugin: str
    plugin_id: int
    answer: PluginAnswer
    allows_skip: bool = True
