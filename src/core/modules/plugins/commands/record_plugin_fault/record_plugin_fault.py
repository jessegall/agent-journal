from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin import Plugin


@dataclass(frozen=True)
class RecordPluginFault(Command[Plugin]):
    """Records a fault a plugin's program made: a late run, an error code, or an answer that is not JSON."""

    plugin_id: int
    fault: str
