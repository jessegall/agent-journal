from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.support.plugin_upgrade import PluginUpgrade


@dataclass(frozen=True)
class UpgradePlugin(Command[PluginUpgrade]):
    """A person upgrades a plugin from its source; without confirmation it only shows what would change."""

    name: str
    confirmed: bool
