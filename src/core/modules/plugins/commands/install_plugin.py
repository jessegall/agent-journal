from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.commands.support.plugin_install import PluginInstall


@dataclass(frozen=True)
class InstallPlugin(Command[PluginInstall]):
    """The person installs a plugin from its folder; without confirmation it only shows what it would install."""

    source: str
    confirmed: bool
