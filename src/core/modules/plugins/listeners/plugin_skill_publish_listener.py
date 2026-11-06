from core.base.change.event_log import JOURNAL_BOOTING_EVENT
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles
from core.base.change.journal_booting import JournalBooting


class PluginSkillPublishListener(CommitListener[JournalBooting]):
    """As the journal starts, republishes the skills of every plugin that is switched on."""

    name = "plugins.publish-skills"

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles) -> None:
        self.plugins, self.folders, self.skill_files = plugins, folders, skill_files

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for plugin in self.plugins.enabled_plugins():
            folder = self.folders.code(plugin.name)
            self.skill_files.publish(folder, PluginManifest.read(folder))
