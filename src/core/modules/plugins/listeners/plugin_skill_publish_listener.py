from engine.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles
from engine.change.journal_booting import JournalBooting


class PluginSkillPublishListener(CommitListener[JournalBooting]):
    """As the journal starts, republishes the skills of every plugin that is switched on."""

    name = "plugins.publish-skills"

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders, skill_files: PluginSkillFiles) -> None:
        self.runnable, self.folders, self.skill_files = runnable, folders, skill_files

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for runnable in self.runnable.running():
            self.skill_files.publish(self.folders.code(runnable.plugin.name), runnable.manifest)
