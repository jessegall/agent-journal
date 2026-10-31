from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin import Plugin


@dataclass(frozen=True)
class SwitchOffChangedPlugin(Command[Plugin]):
    """Switches off a plugin whose files changed since the person last installed or switched it on."""

    plugin_id: int
