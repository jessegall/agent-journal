from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin import Plugin


@dataclass(frozen=True)
class ClearPluginFaults(Command[Plugin]):
    """Starts a plugin's count of faults in a row again once it answered, and ends its failing."""

    plugin_id: int
