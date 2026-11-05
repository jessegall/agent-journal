from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile


@dataclass(frozen=True)
class ClearPluginQueueFile(Command[PluginQueueFile]):
    """Records a queue file a hook reserved, for its listener to delete once the hook has committed."""

    plugin_id: int
    name: str
