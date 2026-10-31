from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.clear_plugin_queue_file import ClearPluginQueueFile
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile


class ClearPluginQueueFileHandler(Handler[ClearPluginQueueFile, PluginQueueFile]):
    """Saves the reserved file's name, which commits with the hook that reserved it."""

    command = ClearPluginQueueFile

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: ClearPluginQueueFile, context: Context) -> PluginQueueFile:
        return self.repository.save(PluginQueueFile(plugin_id=command.plugin_id, creator_id=context.actor.id, name=command.name), context)
