from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.file.project_reads import ProjectReads
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginProjectReads(ProjectReads):
    """The project folders declared by plugins whose files have not changed, and the data folders those plugins keep."""

    def __init__(self, runnable: RunnablePlugins, home: JournalHome, folders: PluginFolders) -> None:
        self.runnable, self.home, self.plugin_folders = runnable, home, folders

    def folders(self, project_root: Path) -> tuple[Path, ...]:
        return tuple(dict.fromkeys(folder for runnable in self.runnable.running() for folder in runnable.manifest.project_folders(project_root, self.home.folder)))

    def writable_folders(self) -> tuple[Path, ...]:
        return tuple(self.plugin_folders.data(runnable.plugin.name).resolve() for runnable in self.runnable.running())
