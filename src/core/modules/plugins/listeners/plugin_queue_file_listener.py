from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_queue import PluginQueue


class PluginQueueFileListener(CommitListener):
    """Deletes a queue file a hook reserved, now that the hook has committed and its lines reached the agent."""

    name = "plugins.queue-file"
    event = "plugin_queue_file.create"

    def __init__(self, queries: Queries, folders: PluginFolders) -> None:
        self.queries, self.folders = queries, folders

    def handle(self, event: LoggedEvent) -> None:
        row = self.queries.query(PluginQueueFile).find(event.row_id)
        PluginQueue(self.folders.data(self.queries.query(Plugin).find(row.plugin_id).name)).remove(row.name)
