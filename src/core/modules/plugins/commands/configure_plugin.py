from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin_setting import PluginSetting


@dataclass(frozen=True)
class ConfigurePlugin(Command[PluginSetting]):
    """The person sets one of a plugin's declared settings."""

    name: str
    key: str
    value: str
